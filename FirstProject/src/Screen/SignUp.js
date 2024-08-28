import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import MyTextInput from '../Component/MyTextInput';
import MySubmitBtn from '../Component/MySubmitBtn';
import axios from 'axios';
import { BASE_URL, SIGN_UP } from '../Config';


const SignUp = ({ navigation }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [nameerror, setNameError] = useState('');
  const [passworderror, setPasswordError] = useState('');
  const [mobileError, setMobileError] = useState('');

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const mobileRegex = /^[0-9]{10}$/;

  const handleUp = async () => {
    let isValid = true;

    if (name.trim() === '') {
      setNameError('Please enter your name.');
      isValid = false;
    } else if (!nameRegex.test(name)) {
      setNameError('Please enter a valid name.');
      isValid = false;
    } else {
      setNameError('');
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!mobileRegex.test(mobile)) {
      setMobileError('Please enter a valid 10 digit mobile number.');
      isValid = false;
    } else {
      setMobileError('');
    }

    const postData = {
      username: name,
      userPhoneNo: mobile,
      password: password,
    };

    if (isValid) {
      await axios
        .post(SIGN_UP, postData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          //  console.log('Response:', response.data);
          navigation.goBack();
        })
        .catch(error => {
          //  console.error('Error:', error);
        });
    }
  };

  return (
    <ScrollView showsHorizontalScrollIndicator={false} style={styles.maincontainer}>
      <View style={styles.imageView}>
        <Image
          source={require('../../assets/Image/image.png')}
          style={styles.icon}
        />
      </View>

      <View>
        <Text style={styles.Txt}>Sign Up</Text>
      </View>

      <View style={{ marginTop: 40 }}>
        <MyTextInput
          value={name}
          image={require('../../assets/Image/user.png')} tintColor={'grey'} width={24} height={24}
          placeholder={'Enter UserName'}
          onChangeText={txt => {
            setName(txt), setNameError('');
          }}
        />
        {nameerror && (
          <Text
            style={{
              fontSize: 19,
              color: 'red',
              marginLeft: '26%',
              marginTop: 5,
            }}>
            {nameerror}
          </Text>
        )}

        <MyTextInput
          value={mobile}
          image={require('../../assets/Image/phone.png')} tintColor={'grey'} width={24} height={24}
          placeholder={'Enter Mobile Number'}
          maxLength={10}
          keyboardType={'number-pad'}
          onChangeText={txt => {
            setMobile(txt), setMobileError('');
          }}
        />
        {mobileError && (
          <Text
            style={{
              fontSize: 19,
              color: 'red',
              marginLeft: '26%',
              marginTop: 5,
            }}>
            {mobileError}
          </Text>
        )}

        <MyTextInput
          value={password}
          image={require('../../assets/Image/lock.png')} tintColor={'grey'} width={24} height={24}
          maxLength={6}
          placeholder={'Enter Password'}
          onChangeText={txt => {
            setPassword(txt), setPasswordError('');
          }}
        />
        {passworderror && (
          <Text
            style={{
              fontSize: 19,
              color: 'red',
              marginLeft: '26%',
              marginTop: 5,
            }}>
            {passworderror}
          </Text>
        )}
      </View>

      <View style={{ marginTop: 30 }}>
        <MySubmitBtn onPress={() => handleUp()} title={'Submit'} />
      </View>

      <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 20 }}>
        <Text style={{ fontSize: 23, color: '#000' }}>Already Login?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text
            style={{
              fontSize: 23,
              color: 'blue',
              textDecorationLine: 'underline',
            }}>
            {' '}
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  imageView: {
    alignItems: 'center',
    marginTop: 30,
  },
  icon: {
    width: 200,
    height: 200,
  },
  Txt: {
    fontSize: 52,
    color: '#000',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 40,
  },
});
