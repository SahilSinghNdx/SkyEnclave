import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

const CommonTxtInput = ({ placeholder, value, onChangeText, tintColor, maxLength, keyboardType, image, width, height, editable }) => {
  return (
    <View style={{ marginTop: 10, flexDirection: 'row', width: '50%', height: 50, backgroundColor: '#e5e5e5', alignItems: 'center', borderRadius: 10 }}>
      <Image source={image} style={{ width: width, height: height, marginLeft: 20, tintColor: tintColor }} />
      <TextInput placeholder={placeholder} onChangeText={onChangeText} keyboardType={keyboardType} value={value} maxLength={maxLength} placeholderTextColor='#8e8e8e' style={{ width: '85%', fontSize: 20, color: '#000', fontWeight: '400' }} editable={editable} />
    </View>
  )
}

export default CommonTxtInput;

const styles = StyleSheet.create({});