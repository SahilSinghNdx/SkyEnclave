import { Image, StyleSheet, View, ActivityIndicator, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { GET_ENTRIES } from '../Config';

const { width, height } = Dimensions.get('window');

const Splash = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

  const isTablet = width > 600;

  // Write a callback function where will get the data from splash and update the app navigator based on the return which we will get from the splash.
  const checkAuthStatus = async () => {
    try {
      const storedTokenSaas = await AsyncStorage.getItem('tokenIDSaaS');
      const storedTokenGuard = await AsyncStorage.getItem('tokenIDGurad');

      if (storedTokenGuard) {
        navigation.replace('Main'); // Replace with Main screen
      } else if (storedTokenSaas) {
        navigation.replace('DrawerNavigation'); // Replace with DrawerNavigation screen
      } else {
        navigation.replace('Login'); // Replace with Login screen
      }
    } catch (error) {
      //console.error('Error checking authentication status:', error);
      navigation.replace('Login'); // Fallback to Login screen
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const Styles = {
    imageStyle: {
      width: isTablet ? 300 : 150, // Larger size for tablets
      height: isTablet ?300 : 150,
      borderRadius: 10,
    },
  };

  // const fetchToken = async () => {
  //   try {
  //     const storedToken = await AsyncStorage.getItem('tokenID');
  //     const userData = await AsyncStorage.getItem('userData');

  //     console.log(storedToken, '---------------------->');
  //     console.log(userData, '---------------------->');

  //     if (storedToken && userData) {
  //       const parsedUserData = JSON.parse(userData);
  //       const { society_id, createdBy } = parsedUserData;

  //       const response = await axios.get(GET_ENTRIES);
  //       const filteredEntries = response.data.data.filter(
  //         entry =>
  //           entry.society_id === society_id && entry.createdBy === createdBy,
  //       );

  //       console.log('Filtered Entries----------->:', filteredEntries);

  //       if (filteredEntries.length > 0) {
  //         console.log('Navigating to Main with entries:', filteredEntries);
  //         navigation.navigate('Main');
  //       } else {
  //         console.log('No data found.');
  //         alert('No data available.');
  //       }
  //     } else {
  //       navigation.navigate('Login');
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch token or entries', error);
  //     navigation.navigate('Login');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   setTimeout(() => {
  //     fetchToken();
  //   }, 2000);
  // }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <>
          <Image
            source={require('../../assets/Image/image.png')}
            style={Styles.imageStyle}
          />
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.activityIndicator}
          />
        </>
      ) : null}
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicator: {
    zIndex: 1, // Ensure it is above the image
  },
});
