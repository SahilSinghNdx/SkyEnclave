import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import GuestEntries from '../tabviewscreen/guestentries/GuestEntries';
import StaffAttendance from '../tabviewscreen/staffattendance/StaffAttendance';


const Tab = createMaterialTopTabNavigator();

const TabView = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Guest Entries" component={GuestEntries} />
            <Tab.Screen name="Staff Attendance" component={StaffAttendance} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({})

export default TabView;