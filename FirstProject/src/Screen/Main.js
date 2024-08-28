import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
  SafeAreaView,
  useWindowDimensions,
  ActivityIndicator,
  BackHandler,
  Alert
} from 'react-native';
import MyButton from '../Component/MyButton';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import i18n from '../../Services/i18next';
import { BASE_GUARD, GET_ENTRIES, GET_GETVERIFYMAID } from '../Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Modal from 'react-native-modal';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const Main = ({ navigation, route }) => {

  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 800;


  const { t } = useTranslation();

  const animation = useSharedValue(0);

  const animationStyle = useAnimatedStyle(() => {
    return {
      width:
        animation.value == 1
          ? withTiming(300, { duration: 200 })
          : withTiming(0, { duration: 200 }),
    };
  });

  useFocusEffect(
    useCallback(() => {
      const handleBackButton = () => {
        Alert.alert(
          "Hold on!",
          "Are you sure you want to exit?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel",
            },
            { text: "YES", onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', handleBackButton);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
      };
    }, [])
  );

  const [entries, setEntries] = useState([]);
  const [currentLanguage, setLanguage] = useState('en');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [showRegular, setShowRegular] = useState(true);
  const [value, setValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userID, setUserID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);

  // console.log('------------>newUserId',userID)

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLanguage).then(() => setLanguage(newLanguage));
  };

  const getUserData = async () => {
    try {
      const societyId = await AsyncStorage.getItem('societyID');
      if (societyId) {
        return societyId;
      }
      return null;
    } catch (error) {
      // console.error('Error retrieving society ID from AsyncStorage:', error);
      return null;
    }
  };

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      const societyId = await getUserData();
      if (!societyId) {
        return;
      }

      const response = await axios.get(GET_ENTRIES);
      const filteredEntries = response.data.data.filter(
        entry => entry.society_id === societyId
      );
      setEntries(filteredEntries);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes} ${amOrPm}`;
  };

  const guardLogOut = async navigation => {
    const currentTime = getCurrentTime();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    try {
      // Retrieve user data from AsyncStorage
      const userData = await AsyncStorage.getItem('userData');
      console.log('userData --> ', userData);

      const parsedData = JSON.parse(userData);

      if (parsedData) {
        const userID = parsedData._id;
        const createdBy = parsedData.createdBy;

        const currentTime = getCurrentTime();
        const response = await axios.post(
          `https://app.guardx.cloud/api/guardLogin`,
          {
            guardId: userID,
            createdBy: createdBy,
            clockInTime: currentTime,
            clockOutTime: null,
            date: `${day}/${month}/${year}`,
          },
        );
        console.log('API Response:', response);

        await AsyncStorage.clear();
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          }),
        );
      } else {
        console.error('No user data found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Error logging in guard:', error);
    }
  };



  const handlePress = async item => {
    // console.log('00000000000000------>', item);
    setUserID(item._id)
    navigation.navigate('ListOfEntries', {
      data: item._id,
      titleEnglish: item.titleEnglish
    });
    await AsyncStorage.setItem('Regular', JSON.stringify(item));
  };

  const filteredEntries = entries.filter(entry =>
    showRegular
      ? entry.entryType === 'Regular'
      : entry.entryType === 'Occasional',
  );

  const onSearch = searchText => {
    setSearchQuery(searchText);
  };

  const displayedEntries = filteredEntries.filter(item =>
    item.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const BtnView = ({ text, style, image, onPress }) => (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
        <Image source={image} style={{ width: 20, height: 20 }} />
        <TouchableOpacity onPress={onPress}>
          <Text
            style={{
              fontSize: 20,
              color: 'black',
              marginLeft: 20,
              fontWeight: '500',
            }}>
            {text}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // const logOut = async () => {
  //   try {
  //     await AsyncStorage.clear();
  //     navigation.dispatch(
  //       CommonActions.reset({
  //         index: 0,
  //         routes: [{ name: 'Login' }],
  //       })
  //     );
  //   } catch (error) {
  //     // console.error('Error during logout', error);
  //   }
  // };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  

  return (
    <SafeAreaView style={styles.container}>
      <View style={{
        width: screenWidth, height: screenHeight - 780, flexDirection: 'row',
        justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Image
          source={require('../../assets/Image/image.png')}
          style={styles.headerImage}
        />
        <View style={{ flexDirection: 'row', marginRight: 15 }}>
          <TouchableOpacity
            onPress={toggleLanguage}
            style={[
              styles.languageButton,
              {
                backgroundColor: currentLanguage === 'en' ? '#42D176' : '#FFB74D',
              },
            ]}>
            <Text style={styles.languageText}>
              {currentLanguage === 'en' ? 'Eng' : 'हिंदी'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => toggleModal()} style={{}}>
            <Image
              source={require('../../assets/Image/man1.png')}
              style={styles.profileIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        isVisible={showModal}
        onBackdropPress={toggleModal}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        backdropOpacity={0.5}
        style={styles.modal}
        useNativeDriver={true}>
        <View style={[styles.modalView, {
          width: isTablet ? 250 : 195,
          height: '100%'
        }]}>
          <TouchableOpacity
            style={{
              borderWidth: 0.7,
              height: 30,
              width: 30,
              justifyContent: 'center',
              marginLeft: 10,
              marginTop: 20,
              elevation: 5,
              backgroundColor: 'white',
              alignItems: 'center',
              borderRadius: 7,
            }}
            onPress={() => toggleModal()}>
            <Image
              source={require('../../assets/Image/close.png')}
              style={{ width: 18, height: 18 }}
            />
          </TouchableOpacity>
          <View style={{ alignItems: 'center', marginTop: 20 }}>

          </View>
          <View
            style={{
              marginTop: '15%',
              width: '90%',
              alignSelf: 'center',
              // backgroundColor:'red'
            }}>
            <BtnView
              text={t('Profile')}
              onPress={() => {
                navigation.navigate('ProfileGuard', { currLang: currentLanguage });
                toggleModal();
              }}
              image={require('../../assets/Image/settings.png')}
            />
            <BtnView
              onPress={() => {
                navigation.navigate('AttendanceGuard', toggleModal())
              }}
              text={t('Attendance')}
              image={require('../../assets/Image/attend.png')}
            />
            <BtnView
              onPress={() => { guardLogOut(navigation) }}
              text={t('Logout')}
              image={require('../../assets/Image/logout.png')}
            />
          </View>
        </View>
      </Modal>
      <View style={styles.switchContainer}>
        <TouchableOpacity onPress={() => setShowRegular(!showRegular)}>
          <Text style={styles.switchLabel}>
            {showRegular ? t('GuestEntries') : t('StaffAttendance')}
          </Text>
        </TouchableOpacity>
      </View>


      <View style={[
        styles.headerContainer,
        isTablet && styles.headerContainerTablet,
      ]}>
        <View
          style={[{
            alignSelf: 'flex-start',
            marginLeft: 10,

          }, isTablet && { marginLeft: screenWidth / 2.3 }]}>
          <Text style={[styles.entryTypeText, {}]}>{t('Type')}</Text>
        </View>
        <View
          style={[{ alignSelf: 'center', marginRight: 10 }, isTablet && { marginRight: '1%' }]}>
          <View style={{ backgroundColor: '#D3D3D3', borderRadius: 10, width: 130, height: isTablet ? 40 : 34 }}>
            <TextInput
              value={searchQuery}
              placeholder={t('Search')}
              placeholderTextColor="#000"
              style={{
                fontSize: 14,
                color: '#000',
                marginLeft: 5
              }}
              onChangeText={onSearch}
            />
          </View>
        </View>
      </View>

      <View style={{ flex: 1, marginTop: 30 }}>
        {displayedEntries && displayedEntries.length > 0 ? (
          <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 30 }}>
            <View style={styles.buttonContainer}>
              {displayedEntries.map(item => (
                <View style={styles.buttonWrapper} key={item._id}>
                  {item.entryType === 'Occasional' ? (
                    <MyButton
                      onPress={async () => {
                        await AsyncStorage.setItem(
                          'Occasional',
                          JSON.stringify(item),
                        );
                        navigation.navigate('Purpose', {
                          currLang: currentLanguage,
                          textTitle: item.titleEnglish,
                        });
                      }}
                      text={
                        item.titleEnglish
                      }
                      image={
                        item.icon
                          ? {
                            uri: `${BASE_GUARD}/${item.icon.replace(
                              /^public\//,
                              '',
                            )}`,
                          }
                          : null
                      }
                      nameT={item.titleEnglish}
                    />
                  ) : (
                    <MyButton
                      onPress={() => handlePress(item)}
                      text={
                        item.titleEnglish
                      }
                      image={
                        item.icon
                          ? {
                            uri: `${BASE_GUARD}/${item.icon.replace(
                              /^public\//,
                              '',
                            )}`,
                          }
                          : null
                      }
                      nameT={item.titleEnglish}
                    />
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: isTablet ? 22 : 18, color: 'black', fontWeight: '700' }}>{t('Nodata')}</Text>
          </View>
        )}
      </View>

      
    </SafeAreaView>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  headerImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginLeft: 15
  },
  languageContainer: {
    width: '15%',
    height: 80,
    //flexDirection: 'row',
    // justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    marginRight: 5,
  },
  languageButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  },
  languageText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  switchLabel: {
    fontSize: 20,
    // marginHorizontal: 10,
    color: 'black',
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
  entryTypeText: {
    fontSize: 33,
    color: '#000',
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 20, flexWrap: 'wrap'
  },
  buttonWrapper: {
    //paddingRight: '5%'
  },

  searchIconContainer: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // position: 'absolute',
    // right: 4
  },
  modalView: {

    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    position: 'absolute',
    right: 4,
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  profileIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContainerTablet: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalview: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modaltext: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalbuttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalbutton: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10,
  },
  modalbuttonText: {
    color: 'white',
    fontSize: 16,
  },
});
