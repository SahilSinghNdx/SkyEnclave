import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import FloatingButton from './FloatingButton';

const ScreenWrapper = ({ children }) => {
  const routeName = useNavigationState(state => state.routes[state.index].name);
  const [openFloatingMenu, setOpenFloatingMenu] = React.useState(false);

  const handleFloatingButtonPress = () => {
    console.log(openFloatingMenu);
    setOpenFloatingMenu(!openFloatingMenu);
  };

  return (
    <View style={{ flex: 1 }}>
      {children}
      {routeName !== 'Login' &&
        routeName !== 'Splash' &&
        routeName !== 'DrawerNavigation' && routeName !== 'TabView' && (
          <FloatingButton
            isVisible={openFloatingMenu}
            onPress={handleFloatingButtonPress}
          />
        )}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({})