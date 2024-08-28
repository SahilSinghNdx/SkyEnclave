import { StyleSheet, Text, View,TouchableOpacity,Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AttendanceUser = ({ navigation }) => {
  const [attend, setAttend] = useState('');
  const [userID, setUserID] = useState(null);

  const fetchData = async () => {
    try {
      // Fetch User ID from AsyncStorage
      const storedUserID = await AsyncStorage.getItem('userID');
      if (storedUserID) {
        console.log('UserID:', storedUserID);
        setUserID(storedUserID);

        // Fetch data from the API
        const response = await axios.get('https://app.guardx.cloud/api/getGuardInOut');
        if (response.data.data) {
          const filteredEntries = response.data.data.filter(
            entry => entry.societyId === storedUserID
          );
          console.log('Filtered Entries:', filteredEntries);
          setAttend(filteredEntries);
        } else {
          console.log('No data found in response');
        }
      } else {
        console.log('No UserID found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    } 
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <View style={styles.mainContianer}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Image
            source={require('../../../assets/Image/back.png')}
            style={styles.backImage}
          />
        </TouchableOpacity>
        <Text style={styles.headingtxt}>My Attendance</Text>
      </View>

      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Date</Text>
          <Text style={styles.headerText}>Clock IN Time</Text>
          <Text style={styles.headerText}>Clock OUT Time</Text>
       
        </View>
      </View>

      <FlatList
        data={attend}

       

        renderItem={({ item }) => {
          return (
            <View style={styles.itemContainer}>
              <View style={{ width: 120 }}>
                <Text style={[styles.itemText, { marginLeft: '5%' }]}>{item.date}</Text>

              </View>
              <View style={{ width: 120,marginRight:'8%' }}>
                <Text style={styles.itemText}>{item.clockInTime}</Text>

              </View>
           
              <View style={{ width: 110, marginRight: '3%' }}>
                <Text style={styles.itemText}>{item.clockOutTime}</Text>

              </View>

            
             
            </View>
          )
        }}

      />
    </View>
  )
}

export default AttendanceUser

const styles = StyleSheet.create({
  mainContianer: { flex: 1, backgroundColor: '#fff' },
  headingtxt: {
    fontSize: 42,
    color: '#000',
    fontWeight: '600',
  },
  header: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '60%',
    //backgroundColor: 'red'
  },
  backButton: {
    marginLeft: '5%',
  },
  backImage: {
    width: 60,
    height: 40,
  },
  headerContainer: {
    width: '92%',
    height: 60,
    backgroundColor: '#FA8D8D',
    borderRadius: 10,
    marginTop: '8%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: '3%',
    paddingRight: '3%',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  itemContainer: {
    width: '92%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 2,
    borderRadius: 10
  },
  itemText: {
    textAlign: 'center',
    fontSize: 17,
    color: '#000',
    fontWeight: '500'
  },
  itemHouseDetails: {
    justifyContent: 'center'
  },
  itemCenter: {
    width: '6%',
    // backgroundColor: 'red',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
})