import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import React from 'react';
const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');

const MySubmitBtn = ({title, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: screenWidth * 0.45,
        height: 60,
        backgroundColor: '#f64f6d',
        alignSelf: 'center',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{fontSize: 26, color: '#fff', fontWeight: '500'}}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default MySubmitBtn;

const styles = StyleSheet.create({});
