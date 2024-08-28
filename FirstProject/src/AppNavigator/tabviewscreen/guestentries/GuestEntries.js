import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import {
    Button,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { BASE_GUARD, GET_USER_NON_VERIFIED } from '../../../Config';
import axios from 'axios';
import DateTimePicker from 'react-native-modal-datetime-picker';


const GuestEntries = () => {
    const [userData, setUserData] = useState({});
    const [data, setData] = useState('');
    const [userId, setUserId] = useState('');
    const [filteredData, setFilteredData] = useState(null);
    const [userID, setUserID] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const fetchData = async () => {
        try {
            const storedUserID = await AsyncStorage.getItem('userID');
            if (storedUserID) {
                console.log('UserID retrieved from AsyncStorage:', storedUserID);
                setUserID(storedUserID);

                const response = await axios.get(GET_USER_NON_VERIFIED);
                if (response.status === 200 && response.data?.data) {
                    console.log('API Response Full Data:', response.data.data);

                    const filtered = response.data.data.filter(item => item.guardId === storedUserID);
                    setFilteredData(filtered);
                    console.log('Filtered Data:', filtered);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
        hideDatePicker();
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
{/*          
                <TouchableOpacity onPress={showDatePicker} style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 18, color: '#8831CD' }}>Sahil
                    </Text>
                </TouchableOpacity> */}
                <Button title="Show Date Picker" onPress={showDatePicker} />
                <DateTimePicker
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />

                <View style={{ width: 120, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10, flexDirection: 'row', backgroundColor: '#D3D3D3' }}>
                    <TextInput
                        placeholder={'Search here..'}
                        placeholderTextColor='#8e8e8e'
                        style={{ width: '85%', fontSize: 15, color: '#000' }}
                    />
                </View>
            </View>

           
            <FlatList
                style={{marginTop:8}}
                    data={filteredData}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        const houseDetails = JSON.parse(item.houseDetails);
                        const imagePath = item.image?.[0]?.replace(/^public\//, '') || '';
                        const imageUrl = `${BASE_GUARD}/${imagePath}`;
                        return (
                            <View
                                style={{
                                    backgroundColor: '#ecece6',
                                    elevation: 3,
                                    width: '90%',
                                    height: 150,
                                    margin: 10,
                                    borderRadius: 8,
                                    alignSelf: 'center',
                                    marginBottom: filteredData.length - 1 === index ? 10 : 0,
                                }}>

                                <View style={{ flexDirection: "row", alignItems: 'center' }}>

                                    <Image
                                        source={{ uri: imageUrl }}
                                        style={{ width: 80, height: 110, borderRadius: 8, marginLeft: 20, marginTop: 20 }}
                                    />
                                    <View style={{ marginLeft: 20 }}>
                                        <Text style={{ fontSize: 15, color: '#000' }}>{item.entryType}</Text>
                                        <Text style={{ fontSize: 15, color: '#000' }}>{item.submitedDate}</Text>
                                        <Text style={{ fontSize: 15, color: '#000' }}>{'House No : ' + houseDetails.houseNo}</Text>
                                        <Text style={{ fontSize: 15, color: '#000' }}>{'Purpose : ' + item.purposeType}</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 200, marginTop: 10 }}>
                                            <Text style={{ fontSize: 10, color: '#000', fontWeight: '600' }}>{'Clock In :' + item.submitedTime}</Text>
                                            <Text style={{ fontSize: 10, color: '#000', fontWeight: '600' }}>{'Clock Out:' + '???'}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        );
                    }}
                />
            </View>
      
    );
};

const styles = StyleSheet.create({});

export default GuestEntries;

