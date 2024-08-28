import { Image, ScrollView, StyleSheet, Text, View, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import MyTextInput from '../Component/MyTextInput';
import MySubmitBtn from '../Component/MySubmitBtn';
import axios from 'axios';
import { LOGIN_UP } from '../Config';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = ({ navigation }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [newData, setNewData] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 800;

  let ExistingData = newData

  // console.log(ExistingData, '222222222222222222222')
  const animationRef = useRef(null);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


  const isValidEmail = (email) => {
    if (email.trim() === '') {
      setNameError('Please enter your Email.');
      return false;
    } else if (!emailRegex.test(email)) {
      setNameError('Please enter a valid Email.');
      return false;
    } else {
      setNameError('');
      return true;
    }
  }

  const isValidPassword = (password) => {
    if (password.trim() === '') {
      setPasswordError('Please enter your password.');
      return false;
    } else if (password.length < 4 || password.length > 15) {
      setPasswordError('Password must be between 4 and 15 characters.');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  }

  const isValid = (email, password) => {
    // return isValidEmail(email) && isValidPassword(password);
  }
  const apiLogin = (email, password) => {
    return new Promise((resolve, reject) => {
      axios.post(LOGIN_UP, {
        username: email,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.status === 200 && response.data.msg) {
            resolve(response.data);
            // console.log('------------->SuccessFulll added', response.data.data)
            setNewData(response.data.data)
            AsyncStorage.setItem('userData', JSON.stringify(response.data.data));
          } else {
            reject('Invalid Credentials');
          }
        })
        .catch(error => {
          reject(error.message);
        });
    });
  }

  const handleLogin = async () => {
    // Reset errors
    const isEmailValid = isValidEmail(name);
    const isPasswordValid = isValidPassword(password);

    if (isEmailValid && isPasswordValid) {
      try {
        const data = await apiLogin(name, password);
        console.log('Login Log-->', data);
        const { defaultPermissionLevel, _id, role, society_id } = data?.data;
        const { token } = data;
        if (defaultPermissionLevel === 4) {
          await setLocalData({ _id, role, society_id, token, id: 4 });
          navigation.navigate('DrawerNavigation');
        } else if (defaultPermissionLevel === 5) {
          await setLocalData({ _id, role, society_id, token, id: 5 });
          await guardLogin();
        }
        setName('');
        setPassword('');
      } catch (error) {
        // Show alert if login fails
        Alert.alert(' Login Error', 'Please check your email and password.');
      }
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes} ${amOrPm}`;
  };

  const guardLogin = async () => {
    const currentTime = getCurrentTime();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    try {
      // Retrieve user data from AsyncStorage
      const userData = await AsyncStorage.getItem('userData');
      console.log('UserData -s> ', userData);

      const parsedData = JSON.parse(userData);

      if (parsedData) {
        const userID = parsedData._id;
        const createdBy = parsedData.createdBy;
        let clockInTime = null;
        // let clockOutTime = currentTime;
        const response = await axios.post(
          `https://app.guardx.cloud/api/guardLogin`,
          {
            guardId: userID,
            createdBy: createdBy,
            clockInTime: clockInTime,
            clockOutTime: clockInTime ? null : currentTime,
            date: `${day}/${month}/${year}`,
          },
        );
        navigation.navigate('Main');
        console.log('Guard logged in:', response.data);
      } else {
        console.error('No user data found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Error logging in guard:', error);
    }
  };

  // Call guardLogin function when needed
  useEffect(() => {
    guardLogin();
  }, []);
  
  const setLocalData = async (data) => {
    // console.log('333333333333333------>',data)
    try {
  
      await AsyncStorage.setItem('guardID', JSON.stringify(data));
      await AsyncStorage.setItem('userID', data._id);
      await AsyncStorage.setItem('userRole', data.role);
      if (data.id === 4) {
        await AsyncStorage.setItem('tokenIDSaaS', data.token);
      }
      else if (data.id === 5) {
        await AsyncStorage.setItem('tokenIDGurad', data.token);
      }
      if (data.society_id) {
        await AsyncStorage.setItem('societyID', data.society_id);
      }

      const guardID = await AsyncStorage.getItem('guardID');
      console.log('guardID:', JSON.parse(guardID));

    } catch (error) {
      // console.error('Error saving data', error);
    }
  }




  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "android" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.imageView}>
          <LottieView
            ref={animationRef}
            style={{ width: 500, height: 250 }}
            source={require('../../assets/LottieIcon/Animation - 1718948044737.json')}
            autoPlay
            loop
          />
        </View>
        <View>
          <Text style={[styles.Txt, { fontSize: isTablet ? 65 : 45 }]}>LOGIN</Text>
        </View>
        <View style={styles.inputContainer}>
          <MyTextInput
            image={require('../../assets/Image/user.png')}
            width={24}
            height={24}
            tintColor={'grey'}
            value={name}
            placeholder={'Enter Email'}
            onChangeText={txt => { setName(txt), setNameError('') }}
            maxLength={23}
          />
          {nameError && <Text style={[styles.errorText, { marginLeft: isTablet ? '28%' : 10, fontSize: isTablet ?21:15}]}>{nameError}</Text>}
          <MyTextInput
            image={require('../../assets/Image/lock.png')}
            width={24}
            height={24}
            tintColor={'grey'}
            value={password}
            placeholder={'Enter Password'}
            onChangeText={txt => { setPassword(txt), setPasswordError('') }}
            maxLength={15}
            isPassword={true}
            secureTextEntry={!passwordVisible}
            onTogglePassword={() => setPasswordVisible(!passwordVisible)}
          />
          {passwordError && <Text style={[styles.errorText, { marginLeft: isTablet ? '28%' : 10, fontSize: isTablet ? 21 : 15 }]}>{passwordError}</Text>}
        </View>
        <View style={styles.buttonContainer}>
          <MySubmitBtn onPress={() => handleLogin(name, password)} title={'Submit'} />
        </View>
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't Have an Account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupLink}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
   
  );
}

export default Login;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center', 
    paddingHorizontal: 20,    
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center', 
  },
  imageView: {
    alignItems: 'center',
   
  },
  icon: {
    width: 200,
    height: 200
  },
  Txt: {
    
    color: '#000',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 30
  },
  inputContainer: {
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  errorText: {
    
    color: '#f64f6d',
   // marginLeft: '28%',
    marginTop: 3,
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop:15
  },
  signupText: {
    fontSize: 15,
    color: 'grey',
  },
  signupLink: {
    fontSize: 15,
    color: '#f64f6d',
    marginBottom: '10%',
    fontWeight: '500',
  },
});
