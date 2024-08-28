import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from '../Screen/Login';
import Main from '../Screen/Main';
import Purpose from '../Screen/Purpose';
import Visit from '../Screen/Visit';
import Verification from '../Screen/Verification';
import ProfileUser from '../dashboardscreen/profile/ProfileUser';
import AttendanceUser from '../dashboardscreen/attendance/AttendanceUser';
import Admin from '../SettingTabDashBoard/Admin';
import Role from '../SettingTabDashBoard/Role';
import Attendance from '../DrawerNavigationScreen/allEntries/Attendance';
import DrawerNavigation from '../DrawerNavigator/DrawerNavigation';
import AllEntries from '../DrawerNavigationScreen/AllEntries';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Splash from '../Screen/splash';
import LIstOfEntries from '../Screen/LIstOfEntries';
import ProfileGuard from '../dashboardscreen/profile/ProfileGuard';
import AttendanceGuard from '../dashboardscreen/attendance/AttendanceGuard';
import TabView from './tabview/TabView';
import ScreenWrapper from './custom/ScreenWrapper';


const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
    //     <Stack.Screen name="Splash" component={Splash} />
    //     <Stack.Screen name="Main">
    //       {props => <Main {...props} logOut={() => logOut(props.navigation)} />}
    //     </Stack.Screen>
    //     <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
    //     <Stack.Screen name="AllEntries" component={AllEntries} />
    //     <Stack.Screen name="Admin" component={Admin} />
    //     <Stack.Screen name="Role" component={Role} />
    //     <Stack.Screen name="Attendance" component={Attendance} />
    //     <Stack.Screen name="Profile" component={ProfileUser} />
    //     <Stack.Screen name="AttendanceUser" component={AttendanceUser} />
    //     <Stack.Screen name="Purpose" component={Purpose} />
    //     <Stack.Screen name="ListOfEntries" component={LIstOfEntries} />
    //     <Stack.Screen name="Visit" component={Visit} />
    //     <Stack.Screen name="Verification" component={Verification} />
    //     <Stack.Screen name="ProfileGuard" component={ProfileGuard} />
    //     <Stack.Screen name="Login" component={Login} />
    //     <Stack.Screen name="AttendanceGuard" component={AttendanceGuard} />

    //   </Stack.Navigator>
    // </NavigationContainer>

    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Main">
          {props => (
            <ScreenWrapper>
              <Main {...props} logOut={() => logOut(props.navigation)} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
        <Stack.Screen name="TabView" component={TabView} />

        <Stack.Screen name="AllEntries">
          {props => (
            <ScreenWrapper>
              <AllEntries {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="Admin">
          {props => (
            <ScreenWrapper>
              <Admin {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="Role">
          {props => (
            <ScreenWrapper>
              <Role {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="Attendance">
          {props => (
            <ScreenWrapper>
              <Attendance {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="Profile">
          {props => (
            <ScreenWrapper>
              <ProfileUser {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="AttendanceUser">
          {props => (
            <ScreenWrapper>
              <AttendanceUser {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="ListOfEntries">
          {props => (
            <ScreenWrapper>
              <LIstOfEntries {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="Visit">
          {props => (
            <ScreenWrapper>
              <Visit {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="Verification">
          {props => (
            <ScreenWrapper>
              <Verification {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="ProfileGuard">
          {props => (
            <ScreenWrapper>
              <ProfileGuard {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="Login">
          {props => (
            <ScreenWrapper>
              <Login {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="AttendanceGuard">
          {props => (
            <ScreenWrapper>
              <AttendanceGuard {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>

        <Stack.Screen name="Purpose">
          {props => (
            <ScreenWrapper>
              <Purpose {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
