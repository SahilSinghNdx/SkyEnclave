import React, { useEffect, useState, useMemo } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { BASE_GUARD, GET_PURPOSE } from '../Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyButton from '../Component/MyButton';

const Purpose = ({ route, navigation }) => {
  const currLang = route.params.currLang;

  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 800;

  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // New loading state

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) return;

      const userData = JSON.parse(userDataString);
      const society_id = userData.society_id;

      const response = await axios.get(GET_PURPOSE);
      const filteredData = response.data.data.filter(
        item => item.society_id === society_id
      );

      setData(filteredData);
    } catch (error) {
    //  console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const filteredData = useMemo(() => {
    return searchQuery ? data.filter(item =>
      item.purpose.toLowerCase().includes(searchQuery.toLowerCase())
    ) : data;
  }, [searchQuery, data]);

  const handlePress = async (item) => {
    try {
      await AsyncStorage.setItem('Purpose', JSON.stringify(item));
      navigation.navigate('Visit', { currLang: currLang });
    } catch (error) {
     // console.error('Error saving data to AsyncStorage:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', width: '100%', marginTop: 15, justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
          <Image source={require('../../assets/Image/back.png')} style={{ width: 40, height: 40 }} />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: '600', color: '#000', textAlign: 'center' }}>
          {t('Purpose')}
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
                if (item.purposeIcon && item.purposeIcon.length > 0) {
                  const imagePath = item.purposeIcon.replace(/^public\//, '');
                  imageUri = `${BASE_GUARD}/${imagePath}`;
                }

                return (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }} key={item._id}>
                    <MyButton
                      onPress={() => handlePress(item)}
                      image={imageUri ? { uri: imageUri } : null}
                      text={item.purpose}
                      nameT={item.purpose}
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

export default Purpose;
