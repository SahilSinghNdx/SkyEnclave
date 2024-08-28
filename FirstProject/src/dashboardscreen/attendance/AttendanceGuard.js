import {
    StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Dimensions, SafeAreaView,
    ActivityIndicator
} from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get('window');

const AttendanceGuard = ({ navigation }) => {
    const [attend, setAttend] = useState('');
    const [userID, setUserID] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    const isTablet = width > 600;

    const Styles = {
        imageStyle: {
            width: isTablet ? 300 : 150, // Larger size for tablets
            height: isTablet ? 250 : 150,
            borderRadius: 10,
        },
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);
            // Fetch User ID from AsyncStorage
            const storedUserID = await AsyncStorage.getItem('userID');
            if (storedUserID) {
                //console.log('UserID------>:', storedUserID);
                setUserID(storedUserID);

                // Fetch data from the API
                const response = await axios.get('https://app.guardx.cloud/api/getGuardInOut');
                if (response.data.data) {
                    const filteredEntries = response.data.data.filter(
                        entry => entry.guardId === storedUserID
                    );
                    console.log('Filtered Entries:', filteredEntries);
                    setAttend(filteredEntries);
                    setIsLoading(false);
                }
                setIsLoading(false);
            }
        } catch (error) {
            //console.error('Error fetching data:', error);
            setError(error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.mainContianer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, width: '100%', }}>

                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.replace('Main')} style={{ position: 'absolute', left: 20 }}>
                        <Image source={require('../../../assets/Image/back.png')} style={{ width: 40, height: 40 }} />
                    </TouchableOpacity>
                    <View>
                        <Text
                            style={{
                                fontSize: isTablet ? 42 : 30,
                                fontWeight: '700',
                                color: '#000',
                                textAlign: 'center',
                            }}>
                            {'My Attendance'}
                        </Text>
                    </View>
                </View>

            </View>

            <View style={[styles.headerContainer, { width: '92%', height: isTablet ? 60 : 40 }]}>
                <View style={styles.headerRow}>
                    <Text style={[styles.headerText, { fontSize: isTablet ? 20 : 15, marginLeft: isTablet ? 10 : 10 }]}>Date</Text>
                    <Text style={styles.headerText}>Clock In</Text>
                    <Text style={[styles.headerText, { marginRight: isTablet ? 20 : 15 }]}>Clock Out</Text>

                </View>
            </View>

            <FlatList
                data={attend}
                keyExtractor={item => item._id}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.itemContainer}>
                            <View style={{ width: isTablet ? 120 : 90 }}>
                                <Text style={[styles.itemText, { marginLeft: isTablet ? '5%' : 0, fontSize: isTablet ? 17 : 13 }]}>{item.date}</Text>

                            </View>
                            <View style={{ width: 120, fontSize: isTablet ? 17 : 13 }}>
                                <Text style={styles.itemText}>{item.clockInTime}</Text>

                            </View>

                            <View style={{ width: 110, fontSize: isTablet ? 17 : 13, marginRight: isTablet ? 30 : 0 }}>
                                <Text style={styles.itemText}>{item.clockOutTime}</Text>

                            </View>



                        </View>
                    )
                }}

            />
        </SafeAreaView>
    )
}

export default AttendanceGuard

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