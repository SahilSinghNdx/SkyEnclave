import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import DashBoard from '../DrawerNavigationScreen/DashBoard'
import CustomDrawer from './CustomDrawer'
import GetRequest from '../DrawerNavigationScreen/GetRequest'
import TypeofEntries from '../DrawerNavigationScreen/TypeofEntries'
import PurposeofOcassinaol from '../DrawerNavigationScreen/PurposeofOcassinaol'
import HouseList from '../DrawerNavigationScreen/HouseList'


const Drawer = createDrawerNavigator()


const DrawerNavigation = () => {
    return (

        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />} screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="DashBoard" component={DashBoard} options={{
                drawerIcon: ({ focused }) => (
                    <View style={styles.iconContainer}>
                        <Image source={require('../../assets/Image/grid.png')} style={styles.icon} />
                    </View>
                )
            }} />
            <Drawer.Screen name="Get Entries Requests" component={GetRequest} options={{
                drawerIcon: ({ focused }) => (
                    <View style={styles.iconContainer}>
                        <Image source={require('../../assets/Image/guest.png')} style={styles.icon} />
                    </View>
                )
            }} />

            <Drawer.Screen name="Type of Entries" component={TypeofEntries} options={{
                drawerIcon: ({ focused }) => (
                    <View style={styles.iconContainer}>
                        <Image source={require('../../assets/Image/card.png')} style={styles.icon} />
                    </View>
                )
            }} />
            <Drawer.Screen name="Purpose of Occasional" component={PurposeofOcassinaol} options={{
                drawerIcon: ({ focused }) => (
                    <View style={styles.iconContainer}>
                        <Image source={require('../../assets/Image/question.png')} style={styles.icon} />
                    </View>
                )
            }} />

            <Drawer.Screen name="House of List" component={HouseList} options={{
                drawerIcon: ({ focused }) => (
                    <View style={styles.iconContainer}>
                        <Image source={require('../../assets/Image/house1.png')} style={styles.icon} />
                    </View>
                )
            }} />
        </Drawer.Navigator>

    )
}

export default DrawerNavigation

const styles = StyleSheet.create({
    icon: {
        width: 25,
        height: 25,
        marginRight: 5,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})