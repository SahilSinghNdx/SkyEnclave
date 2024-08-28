import { Image, StyleSheet, TextInput, View, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';

const { width: screenWidth } = Dimensions.get('screen');

const MyTextInput = ({
  placeholder,
  value,
  onChangeText,
  tintColor,
  maxLength,
  keyboardType,
  image,
  width,
  height,
  isPassword,
  secureTextEntry,
  onTogglePassword
}) => {
  return (
    <View style={styles.container}>
      <Image source={image} style={[styles.image, { width, height, tintColor }]} />
      <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        value={value}
        maxLength={maxLength}
        placeholderTextColor='#8e8e8e'
        style={styles.textInput}
        secureTextEntry={secureTextEntry}
      />
      {isPassword && (
        <TouchableOpacity onPress={onTogglePassword} style={styles.eyeIconContainer}>
          <Image
            source={secureTextEntry ? require('../../assets/Image/eyeoff.png') : require('../../assets/Image/eye.png')}
            style={[styles.eyeIcon, { tintColor }]}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MyTextInput;

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    flexDirection: 'row',
    width: screenWidth - 700,
    height: 70,
    backgroundColor: '#e5e5e5',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  image: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 23,
    color: '#000',
    fontWeight: '400',
  },
  eyeIconContainer: {
    padding: 5,
  },
  eyeIcon: {
    width: 24,
    height: 24,
  },
});