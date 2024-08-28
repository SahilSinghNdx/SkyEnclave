import { StyleSheet, TextInput, View } from 'react-native'
import React from 'react'

const MyModalInput = ({ placeholder, value, onChangeText, maxLength, keyboardType }) => {
    return (
        <View style={{ marginTop: 25, width: '70%', height: 80, backgroundColor: '#e5e5e5', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
            <TextInput placeholder={placeholder} onChangeText={onChangeText} keyboardType={keyboardType} value={value} maxLength={maxLength} placeholderTextColor='#8e8e8e' style={{ width: '90%', fontSize: 23, color: '#000', fontWeight: '400' }} />
        </View>
    )
}

export default MyModalInput;

const styles = StyleSheet.create({});