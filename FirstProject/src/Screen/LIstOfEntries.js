import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, SafeAreaView, FlatList, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BASE_GUARD } from '../Config';
import MyButton from '../Component/MyButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const LIstOfEntries = ({ navigation, route }) => {
  const { t } = useTranslation();
  const {data,titleEnglish} = route.params;
// console.log('data mene pichli screen se bheja ',data)
// console.log('000000000011111111------->',titleEnglish)
  
  
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 800;

  const [searchQuery, setSearchQuery] = useState('');
  const [clockStatus, setClockStatus] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
  const [filterData,setFilteredData]=useState([])
   const [filterWord,setFilterWord]=useState([])
  const [verified, setVerified] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://app.guardx.cloud/api/getVerifieUser/${data}`);
      setVerified(response.data.verifyHouseMaid);
      // console.log(response.data.verifyHouseMaid);
      setFilteredData(response.data.verifyHouseMaid);
      setFilterWord(response.data.verifyHouseMaid);  // Initialize filterWord with fetched data
      setLoading(false);  // Stop loading indicator
    } catch (error) {
      // console.error('Error fetching data:', error);
      setLoading(false);  // Stop loading indicator in case of error
    }
  };

  useEffect(() => {
    fetchData();
    const loadClockStatus = async () => {
      try {
        const clockStatus = await AsyncStorage.getItem('ClockStatus');
        if (clockStatus) {
          setClockStatus(JSON.parse(clockStatus));
        }
      } catch (error) {
        //console.error('Failed to load clock status:', error.message);
      }
    };
    loadClockStatus();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = filterData.filter(item =>
      item.houseMaidEnglish && item.houseMaidEnglish.toLowerCase().includes(text.toLowerCase())
    );
    setFilterWord(filtered);
  };


  const handlePersonClick = async (item) => {
    const currentTime = new Date().toLocaleTimeString();
    const currentStatus = clockStatus[item._id];

    let newStatus;
    let message;

    if (!currentStatus || currentStatus.status === 'Clock OUT') {
      newStatus = { status: 'Clock IN', time: currentTime };
      message = `Time: ${currentTime} - ${item.houseMaidEnglish} Clock IN`;
    } else {
      newStatus = { status: 'Clock OUT', time: currentTime };
      message = `Time: ${currentTime} - ${item.houseMaidEnglish} Clock OUT`;
    }

    try {
      await AsyncStorage.setItem('Maid', JSON.stringify(item));
      await AsyncStorage.setItem('ClockInStatus', JSON.stringify(newStatus));

      // Save clock status to AsyncStorage
      const clockStatus = await AsyncStorage.getItem('ClockStatus');
      let status = clockStatus ? JSON.parse(clockStatus) : {};
      status[item._id] = newStatus;
      await AsyncStorage.setItem('ClockStatus', JSON.stringify(status));

      const response = await axios.post('https://app.guardx.cloud/api/verified', {
        maidName: item.houseMaidEnglish,
        guardId: item._id,
        parentId: data,
        clockInTime: newStatus.status === 'Clock IN' ? newStatus.time : '',
        clockOutTime: newStatus.status === 'Clock OUT' ? newStatus.time : '',
      });

      if (response.status === 200) {
        // Data posted successfully
      }
    } catch (error) {
      console.error('Failed to post data:', error.message);
    }
    setClockStatus(prevStatus => ({
      ...prevStatus,
      [item._id]: newStatus
    }));

    alert(message);
  };




  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    <View style={{ flexDirection: 'row', width: '100%', marginTop: 15, justifyContent: 'space-between', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
        <Image source={require('../../assets/Image/back.png')} style={{ width: 40, height: 40 }} />
      </TouchableOpacity>
      <Text style={{ fontSize: 22, fontWeight: '600', color: '#000'}}> {t('Maids')} {titleEnglish}</Text>
      <View style={{ width: 120, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10, flexDirection: 'row', backgroundColor: '#D3D3D3' }}>
        <TextInput
          
            placeholder={t('Search')}
          placeholderTextColor='#8e8e8e'
          style={{ width: '85%', fontSize: 15, color: '#000' }}
            value={searchQuery}
            onChangeText={handleSearch}
        />
      </View>
    </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 30 }}>
          <View style={styles.buttonContainer}>
              {filterWord.length > 0 ? (
                filterWord.map(item => {
                  let imageUri = null;
                  if (item.image && item.image.length > 0) {
                    const imagePath = item.image[0].replace(/^public\//, '');
                    imageUri = `${BASE_GUARD}/${imagePath}`;
                  }


                return (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }} key={item._id}>
                    <MyButton
                      text={item.houseMaidEnglish}
                      image={imageUri ? { uri: imageUri } : null}
                      nameT={item.houseMaidEnglish}
                      onPress={() => handlePersonClick(item)}
                    />
                  </View>
                );
              })
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={{ fontSize: isTablet ? 22 : 18, color: 'black', fontWeight: '700' }}>
                      {t('Nodata')}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}

  </SafeAreaView>
  );                                                                    
};

export default LIstOfEntries;

const styles = StyleSheet.create({
  purposeContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 20, flexWrap: 'wrap'
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20%',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
