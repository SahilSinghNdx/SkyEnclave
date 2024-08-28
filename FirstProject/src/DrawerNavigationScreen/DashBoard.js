import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal
} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  GET_ENTRIES,
  GET_HOUSEDETAILS,
  GET_PURPOSE,
  GET_USER_NON_VERIFIED,
} from '../Config';
import { BarChart, LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EntriesData = ({
  text,
  backgroundColor,
  image,
  TypesOfEntries,
  lengthofText,
}) => (
  <View
    style={[styles.entryContainer, { backgroundColor: '#fff', elevation: 10 }]}>
    <View>
      <Text style={{ fontSize: 32, color: '#000', fontWeight: '600' }}>
        {TypesOfEntries}
      </Text>
      <Text
        style={{
          fontSize: 40,
          color: '#000',
          textAlign: 'center',
          marginTop: '3%',
          fontWeight: '600',
        }}>
        {lengthofText}
      </Text>
    </View>
    <View style={[styles.innerBox, { backgroundColor }]}>
      <Image source={image} style={styles.icon} />
    </View>
  </View>
);

const DashBoard = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [HouseData, setHouseData] = useState([]);
  const [regularEntriesCount, setRegularEntriesCount] = useState(0);
  const [occasionalEntriesCount, setOccasionalEntriesCount] = useState(0);
  const [totalEntriesCount, setTotalEntriesCount] = useState(0);
  const [ownerCount, setOwnerCount] = useState(0);
  const [nonVerified, setNonVerified] = useState([]);
  const [monthlyEntries, setMonthlyEntries] = useState([]);
  const [weeklyEntries, setWeeklyEntries] = useState([]);

  const [NonVerifiedPurpose, setNonVerifiedPurpose] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [userID, setUserID] = useState(null);
  console.log('userID------>', userID)
  const fetchEntries = async () => {
    try {
      // Retrieve userID from AsyncStorage
      const userID = await AsyncStorage.getItem('userID');
      setUserID(userID)

      if (userID) {
        // Fetch the entries from the API
        const response = await axios.get(GET_ENTRIES);
        const entries = response.data.data;

        // Filter entries based on society_id matching the userID
        const filteredEntries = entries.filter(
          entry => entry.society_id === userID
        );

        setData(filteredEntries);

        // Filter and count regular and occasional entries
        const regularEntries = filteredEntries.filter(
          entry => entry.entryType === 'Regular'
        );
        const occasionalEntries = filteredEntries.filter(
          entry => entry.entryType === 'Occasional'
        );

        setRegularEntriesCount(regularEntries.length);
        setOccasionalEntriesCount(occasionalEntries.length);
        setTotalEntriesCount(filteredEntries.length);
      }
    } catch (error) {
      console.error('There was an error fetching the data!', error);
    }
  };

  const fetchHouseDetails = async () => {
    try {
      // Retrieve userID from AsyncStorage
      const userID = await AsyncStorage.getItem('userID');

      if (userID) {
        // Fetch the house details from the API
        const response = await axios.get(GET_HOUSEDETAILS);
        const data = response.data.data;

        // Filter house details based on society_id matching the userID
        const filteredData = data.filter(
          house => house.society_id === userID
        );

        setHouseData(filteredData);

        // Set the count of the filtered data
        setOwnerCount(filteredData.length);
      }
    } catch (error) {
      console.error('There was an error fetching the data!', error);
    }
  };

  const fetchPurposeData = async () => {
    try {
      // Retrieve userID from AsyncStorage
      const userID = await AsyncStorage.getItem('userID');

      if (userID) {
        // Fetch the purposes from the API
        const response = await axios.get(GET_PURPOSE);
        const data = response.data.data;

        // Filter purposes based on society_id matching the userID
        const filteredData = data.filter(
          purpose => purpose.society_id === userID
        );

        // Set the count of the filtered data
        setNonVerifiedPurpose(filteredData.length);
      }
    } catch (error) {
      console.error('Error fetching non-verified purposes data:', error);
    }
  };

  useEffect(() => {
    fetchEntries();
    fetchHouseDetails();
    fetchPurposeData();
  }, [])

  useEffect(() => {
    // Function to fetch userID (you may have it from login or another source)
    const fetchUserID = async () => {
      try {
        const storedUserID = await AsyncStorage.getItem('userID');
        if (storedUserID) {
          setUserID(storedUserID);
        }
      } catch (error) {
        console.error('Error fetching userID:', error);
      }
    };

    
    const fetchNonVerifiedData = async () => {
      try {
        const response = await axios.get(GET_USER_NON_VERIFIED);
        const nonVerifiedData = response.data.data;
        setNonVerified(nonVerifiedData);
        // Ensure filterChartData and filterWeeklyData are called with available userID
        if (userID) {
          filterChartData(nonVerifiedData, userID);
          filterWeeklyData(nonVerifiedData, userID);
        }
      } catch (error) {
        console.error('Error fetching non-verified users data:', error);
      }
    };

    fetchUserID()
    fetchNonVerifiedData()

  }, [userID]);

  const filterChartData = (entries, userID) => {
 // console.log('Data received for filtering:', entries);
  //console.log('User ID received for matching:', userID);

  // Initialize monthlyData with zero values
  const monthlyData = new Array(12).fill(0);

  entries.forEach(entry => {
    // Check if the entry's createdBy field matches the userID
    if (entry.createdBy === userID) {
      //console.log('Matching user ID:', entry.createdBy);

      // Parse the date
      const [day, month, year] = entry.submitedDate.split('-');
     // console.log('Parsed Date:', { day, month, year });

      // Ensure the date is valid
      const date = new Date(`${year}-${month}-${day}`);
      //console.log('Date Object:', date);

      // Check if the date is valid before accessing month
      if (!isNaN(date.getTime())) {
        const monthIndex = date.getMonth();
      //  console.log('Month Index:', monthIndex);

        // Increment the count for the respective month
        monthlyData[monthIndex]++;
     //   console.log('Updated monthlyData:', monthlyData);
      } else {
        console.error('Invalid date:', entry.submitedDate);
      }
    } else {
      //console.log('User ID does not match:', entry.createdBy);
    }
  });

  // Update the state with the filtered monthly data
  console.log('Final monthlyEntries:', monthlyData);
  setMonthlyEntries(monthlyData);
};

  const Down = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [
      {
        data: monthlyEntries,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 1,
      },
    ],
  };

  const filterWeeklyData = (entries, userID) => {
   // console.log('Data received for weekly filtering:', entries);
   // console.log('User ID received for matching:', userID);

    // Initialize weekly data for up to 5 weeks (assuming a month view)
    const weeklyData = new Array(5).fill(0);

    entries.forEach(entry => {
      if (entry.createdBy === userID) {
        const date = new Date(entry.submitedDate);
        const dayOfMonth = date.getDate();
        const week = Math.ceil(dayOfMonth / 7); // Calculate the week number (1-5)

        // Ensure the week is within the range [1, 5]
        if (week >= 1 && week <= 5) {
          weeklyData[week - 1]++; // Convert week to index (0-4)
        }
      }
    });

    setWeeklyEntries(weeklyData);
  };

  // Weekly chart data
  const weeklyChartData = {
    labels: ['1st Week', '2nd Week', '3rd Week', '4th Week', '5th Week'],
    datasets: [
      {
        data: weeklyEntries,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 1,
      },
    ],
  };


  const YearlyDataRegular = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        data: [10, 30, 50, 70, 56, 292, 245],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 6,
      },
      {
        data: [30, 50, 38, 60, 79, 20],
        color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`, // optional
        strokeWidth: 6, // optional
      },
    ],
    legend: ['First Dataset', 'Second Dataset'], // optional
  };

  const openModal = () => {
    console.log("OPen modal ->")
    setModalVisible(true);
  }

  const closeModal = () => {
    console.log("close modal ->")
    setModalVisible(false)
  }

  const handleNavigation = () => {
    navigation.navigate('Profile')
    closeModal()
  }

  const handleNavigationAttendance = () => {
    navigation.navigate('AttendanceUser')
    closeModal()
  }

  const logOut = async () => {
    try {
      await AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error during logout', error);
    }
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image
            source={require('../../assets/Image/menu.png')}
            style={[styles.menuIcon, { marginLeft: 10 }]}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>DashBoard</Text>
        </View>

        <View
          style={{
            width: 60,
            height: 60,
            backgroundColor: '#fff',
            marginRight: 20,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => openModal()}>
            <Image
              source={require('../../assets/Image/man1.png')}
              style={{ width: 35, height: 35 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={styles.entriesContentContainer}>
        <View style={styles.entriesContainer}>
          <View style={styles.entryWrapper}>
            <EntriesData
              backgroundColor={'#df2869'}
              image={require('../../assets/Image/card.png')}
              TypesOfEntries={'Type of Entries'}
              lengthofText={totalEntriesCount}
            />
          </View>
          <View style={styles.entryWrapper}>
            <EntriesData
              backgroundColor={'#11b8cc'}
              image={require('../../assets/Image/travel.png')}
              TypesOfEntries={'Regular Entries'}
              lengthofText={regularEntriesCount}
            />
          </View>
          <View style={styles.entryWrapper}>
            <EntriesData
              backgroundColor={'#5db461'}
              image={require('../../assets/Image/question.png')}
              TypesOfEntries={'Occasional'}
              lengthofText={occasionalEntriesCount}
            />
          </View>
          <View style={styles.entryWrapper}>
            <EntriesData
              backgroundColor={'#fc960e'}
              image={require('../../assets/Image/target.png')}
              TypesOfEntries={'Purpose'}
              lengthofText={NonVerifiedPurpose}
            />
          </View>
          <View style={styles.entryWrapper}>
            <EntriesData
              backgroundColor={'#fc960e'}
              image={require('../../assets/Image/house1.png')}
              TypesOfEntries={'House List'}
              lengthofText={ownerCount}
            />
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: '2%',
        }}>
        <Text
          style={{
            fontSize: 22,
            color: '#000',
            fontWeight: '700',
            marginLeft: '13%',
          }}>
          Monthly Guest Entries
        </Text>
        <Text
          style={{
            fontSize: 22,
            color: '#000',
            fontWeight: '700',
            marginRight: '13%',
          }}>
          Weekly Guest Entries Requests
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {/* <BarChart
          data={Down}
          width={Dimensions.get('screen').width - 690}  // Adjust width as needed
          height={300}
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: 'grey',
            backgroundGradientFrom: '#f64f6d',
            backgroundGradientTo: '#FE1809',
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
            useShadowColorFromDataset: false, // disable shadow color
            fromZero: true, // start y-axis from zero
            formatYLabel: value => `${value}`, // custom format for y-axis labels
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            marginLeft: '1%',
          }}
        /> */}
        <View style={{ marginRight: '1%' }}>
          {/* <LineChart
            data={weeklyChartData}
            width={Dimensions.get('window').width - 630}
            height={300}
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          /> */}
        </View>
      </View>

      <View style={{ alignSelf: 'center' }}>
        {/* <LineChart
                    data={YearlyDataRegular}
                    width={Dimensions.get('window')-30}
                    height={500}
                    // yAxisLabel="$"
                    // yAxisSuffix="k"
                    yAxisInterval={1}
                    chartConfig={{
                        backgroundColor: '#5B5C50',
                        backgroundGradientFrom: '#424242',
                        backgroundGradientTo: '#9DF859',
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: '6',
                            strokeWidth: '2',
                            stroke: '#ffa726',
                        },
                    }}

                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                /> */}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            <View style={{ alignSelf: 'flex-end', marginTop: 10 }}>
              <TouchableOpacity onPress={() => closeModal()}>
                <Image source={require('../../assets/Image/close.png')} style={{ width: 25, height: 25, marginRight: 25 }} />

              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Image source={require('../../assets/Image/settings.png')} style={{ width: 30, height: 30 }} />

              <Text style={{ fontSize: 32, color: '#000', fontWeight: '800', marginLeft: 15 }}>Setting</Text>
            </View>


            <View style={{ marginTop: '8%', marginLeft: '5%' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../../assets/Image/man1.png')} style={{ width: 30, height: 30 }} />

                <TouchableOpacity onPress={handleNavigation}>
                  <Text style={{ fontSize: 30, color: '#000', marginLeft: 20, fontWeight: '600' }}>Profile</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                <Image source={require('../../assets/Image/user.png')} style={{ width: 30, height: 30 }} />

                <TouchableOpacity onPress={handleNavigationAttendance}>
                  <Text style={{ fontSize: 30, color: '#000', marginLeft: 20, fontWeight: '600' }}>My Attendance</Text>

                </TouchableOpacity>

              </View>
              <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                <Image source={require('../../assets/Image/logout.png')} style={{ width: 30, height: 30 }} />
                <TouchableOpacity onPress={()=>logOut()}>
                  <Text style={{ fontSize: 30, color: '#000', marginLeft: 20, fontWeight: '600' }}>Logout</Text>
                </TouchableOpacity>

              </View>
            </View>


          </View>
        </View>
      </Modal>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  menuIcon: {
    width: 36,
    height: 36,
  },
  headerText: {
    fontSize: 32,
    color: 'black',
    fontWeight: '600',
    marginLeft: 20,
  },
  titleContainer: {
    //marginTop: '2%',
    marginLeft: 10,
  },
  title: {
    fontSize: 32,
    color: '#000',
    marginLeft: '2%',
    fontWeight: '700',
  },
  entriesContainer: {
    flexDirection: 'row',
    paddingVertical: 30, // Adjust as needed for vertical padding
  },
  entriesContentContainer: {
    flexGrow: 1,
    // backgroundColor: 'red',
    justifyContent: 'space-between', // Ensure equal spacing between items
    alignItems: 'center',
    marginTop: '4%',
  },
  entryWrapper: {
    flex: 1,
    marginHorizontal: 10,
  },
  entryContainer: {
    width: 300,
    height: 230,
    borderRadius: 10,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'red'
  },
  innerBox: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: -30,
    left: '10%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entryText: {
    fontSize: 30,
    color: 'black',
    marginLeft: 20,
    fontWeight: '500',
  },
  icon: {
    width: 40,
    height: 40,
    tintColor: '#fff',
  },
  countContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  countText: {
    fontSize: 20,
    color: '#000',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '40%',
    height: '40%',
    // padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    //alignItems: 'center',
  },
});

export default DashBoard;
