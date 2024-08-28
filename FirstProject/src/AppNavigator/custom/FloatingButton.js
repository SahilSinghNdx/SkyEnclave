import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Modal,
  Image,
  useWindowDimensions,
} from 'react-native';
import TabView from '../tabview/TabView';

const FloatingButton = ({ onPress, isVisible }) => {
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 800;

  return (
    <View style={{ backgroundColor: 'red' }}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        {/* <Text style={styles.buttonText}>+</Text> */}
    <Image source={require('../../../assets/Image/dots.png')} style={{width:25,height:25,tintColor:'#fff'}}/> 
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onPress}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
                //  backgroundColor:'red',
                width:isTablet? '68%':'63%'
              }}>

              <TouchableOpacity onPress={onPress}>

                <Image
                  source={require('../../../assets/Image/back.png')}
                  style={{ width: 28, height: 22, marginLeft: 10, resizeMode: 'contain' }}
                />
              </TouchableOpacity>

              <Text style={styles.modalText}>My Attendance</Text>

            </View>
        <TabView/>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  buttonText: {
    fontSize: 34,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    // textAlign: 'center',
    // flex: 1,
    color: '#000',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 5,
    width: '50%',
  },
  closeButtonText: {
    color: '#fff',
  },
});

export default FloatingButton;