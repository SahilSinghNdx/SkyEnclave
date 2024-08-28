import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const MyTextView = ({ text }) => {
    return (
        <View style={{ marginTop: 25, flexDirection: 'row', width: '50%', height: 80, backgroundColor: '#e5e5e5', alignSelf: 'center', alignItems: 'center', borderRadius: 10 }}>
            <Text style={{ fontSize: 29, color: '#000', marginLeft: 20 }}>{text}</Text>
        </View>
    )
}

export default MyTextView

const styles = StyleSheet.create({})