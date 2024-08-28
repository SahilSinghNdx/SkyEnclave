import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import MyButton from '../Component/MyButton';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { BASE_GUARD, GET_HOUSEDETAILS } from '../Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Visit = ({ navigation, route }) => {
  const currLang = route.params.currLang;
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 800;

  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Retrieve society_id from AsyncStorage
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        setLoading(false);
        return;
      }

      const userData = JSON.parse(userDataString);
      const society_id = userData.society_id;

      // Fetch data from the API
      const response = await axios.get(GET_HOUSEDETAILS);

      // Filter data based on society_id
      const filteredData = response.data.data.filter(item => item.society_id === society_id);
      setData(filteredData);
      setFilteredData(filteredData); // Initialize filteredData with all filtered data
    } catch (error) {
     // console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = async (item) => {
    try {
      await AsyncStorage.setItem('Visit', JSON.stringify(item));
      navigation.navigate('Verification', { currLang: currLang });
    } catch (error) {
     // console.error('Error saving data to AsyncStorage:', error);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filteredList = data.filter(item =>
      item.ownerName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filteredList);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', width: '100%', marginTop: 15, justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
          <Image source={require('../../assets/Image/back.png')} style={{ width: 40, height: 40 }} />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#000', textAlign: 'center' }}>
          {t('Where To Visit')}
        </Text>
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
          <View style={styles.purposeContainer}>
            {filteredData.length > 0 ? (
              filteredData.map(item => {
                let imageUri = null;
                if (item.ownerImages && item.ownerImages.length > 0) {
                  const imagePath = item.ownerImages[0].replace(/^public\//, '');
                  imageUri = `${BASE_GUARD}/${imagePath}`;
                }

                return (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }} key={item._id}>
                    <MyButton
                      onPress={() => handlePress(item)}
                      title={t('House') + ' - ' + item.houseNo}
                      text={item.ownerName}
                      nameT={item.ownerName}
                      image={imageUri ? { uri: imageUri } : null}
                    />
                  </View>
                );
              })
            ) : (
              <View style={styles.noDataContainer}>
                    <Text style={{ fontSize: isTablet ? 22 : 18, color: 'black', fontWeight: '700' }}>{t('Nodata')}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Visit;

const styles = StyleSheet.create({
  purposeContainer: {
    flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 20, flexWrap: 'wrap'
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
