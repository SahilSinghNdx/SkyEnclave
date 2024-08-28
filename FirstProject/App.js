import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import Main from './src/Screen/Main';
import AppNavigator from './src/AppNavigator/AppNavigator';
import DrawerNavigation from './src/DrawerNavigator/DrawerNavigation';

const App = () => {

  return (
    <AppNavigator
    />

    // <DrawerNavigation />
  );
};

export default App;

const styles = StyleSheet.create({});
