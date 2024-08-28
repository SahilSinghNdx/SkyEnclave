import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';

import axios from 'axios';
import { GET_ENTRIES } from '../Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomDrawer = props => {
    const [RegularEntries, setRegularEntries] = useState(false);
    const [settings, setSettings] = useState(false);
    const [filteredData, setFilteredData] = useState([]);

    const Settings = [
        {
            id: 1,
            userType: 'User',
            // role: 'Role'
        },
        {
            id: 2,
            userType: 'Roles',
            // role: 'User'
        },
    ];

    const [data, setData] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(GET_ENTRIES);
                const allData = response.data.data;
               // console.log('--------------------> All Data', allData);
                setData(allData);

                const society_id = await AsyncStorage.getItem('userID');

                console.log('-------------------------->UserID', society_id);
                if (society_id) {
                    // No need to parse storedUserID if it's a plain string
                    const userId = society_id;

                    const filtered = allData.filter(item =>
                        item.entryType === 'Regular' && item.society_id === userId
                    );
                   // console.log('------------------> Filtered Data', filtered);
                    setFilteredData(filtered);
                }
            } catch (error) {
                console.error('There was an error fetching the data!', error);
            }
        };

        fetchData();
    }, []);

    return (
        <ScrollView style={styles.maincontainer}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{ backgroundColor: '#fff' }}>
                <Image
                    source={require('../../assets/Image/image.png')}
                    style={{ width: 50, height: 50, alignSelf: 'center', marginTop: 10 }}
                />
                <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
                    <Image
                        source={require('../../assets/Image/close.png')}
                        style={{
                            width: 20,
                            height: 20,
                            position: 'absolute',
                            right: 10,
                            bottom: 30,
                        }}
                    />
                </TouchableOpacity>
                <View style={{ marginTop: 20 }}>
                    <DrawerItemList {...props} />

                    <TouchableOpacity
                        onPress={() => setRegularEntries(!RegularEntries)}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 15,
                        }}>
                        <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                            <Image
                                source={require('../../assets/Image/travel.png')}
                                style={styles.icon}
                            />
                            <Text
                                style={{
                                    marginLeft: 35,
                                    fontSize: 16,
                                    color: RegularEntries ? 'blue' : 'black',
                                }}>
                                Regular Entries
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setRegularEntries(!RegularEntries)}>
                            <Image
                                source={
                                    RegularEntries
                                        ? require('../../assets/Image/up.png')
                                        : require('../../assets/Image/down.png')
                                }
                                style={[styles.dropdownIcon, { marginRight: 20 }]}
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>
                    {RegularEntries && (
                        <ScrollView
                            style={[
                                styles.container,
                                {
                                    width: 290,
                                    height: 260,
                                },
                            ]}>
                            {filteredData.map((item, index) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setRegularEntries(false);
                                        props.navigation.navigate('AllEntries', {
                                            titleEnglish: item.titleEnglish, id: item._id
                                        });
                                    }}
                                    key={item._id}
                                    style={styles.itemContainer}>
                                    <Text style={styles.itemText}>{item.titleEnglish}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                <View style={{ marginTop: 27 }}>
                    <TouchableOpacity
                        onPress={() => setSettings(!settings)}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                        <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                            <Image
                                source={require('../../assets/Image/gear.png')}
                                style={styles.icon}
                            />
                            <Text
                                style={{
                                    marginLeft: 35,
                                    fontSize: 16,
                                    color: settings ? 'blue' : 'black',
                                }}>
                                Settings
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => setSettings(!settings)}>
                            <Image
                                source={
                                    settings
                                        ? require('../../assets/Image/up.png')
                                        : require('../../assets/Image/down.png')
                                }
                                style={[styles.dropdownIcon, { marginRight: 20 }]}
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>
                    {settings && (
                        <ScrollView style={[styles.container, { width: 290, height: 100 }]}>
                            {/* {Settings.map((item, index) => (
                                <View key={index} style={{}}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSettings(false);
                                            props.navigation.navigate('Admin', { singh: item.userType });
                                        }}
                                        // key={item}
                                        style={styles.itemContainer}>
                                        <Text style={styles.itemText}>{item.userType}</Text>
                                    </TouchableOpacity>
                                </View>
                            ))} */}

                            <View style={{ marginLeft: '10%', marginTop: 10 }}>
                                <TouchableOpacity onPress={() => {
                                    setSettings(false);
                                    props.navigation.navigate('Admin')

                                }}>
                                    <Text style={{ fontSize: 18, color: 'black', fontWeight: '500', }}>User</Text>

                                </TouchableOpacity>

                                <View style={{ marginTop: 5 }}>
                                    <TouchableOpacity onPress={() => {
                                        setSettings(false);
                                        props.navigation.navigate('Role')

                                    }}>
                                        <Text style={{ fontSize: 18, color: 'black', fontWeight: '500', }}>Roles</Text>

                                    </TouchableOpacity>

                                </View>

                            </View>
                        </ScrollView>
                    )}
                </View>
            </DrawerContentScrollView>
        </ScrollView>
    );
};

export default CustomDrawer;

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
    },
    icon: {
        width: 25,
        height: 25,
        marginLeft: 5,
        resizeMode: 'contain',
    },
    dropdownIcon: {
        width: 15,
        height: 15,
    },
    container: {
        backgroundColor: '#EFE7E7',
        elevation: 3, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 }, // For iOS shadow
        shadowOpacity: 0.25, // For iOS shadow
        shadowRadius: 3.84, // For iOS shadow
        alignSelf: 'center',
        marginTop: 10,
        borderRadius: 10, // Optional: to give rounded corners
    },
    itemContainer: {
        padding: 6,
    },
    itemText: {
        color: '#000',
        fontSize: 15,
        fontWeight: '800',
        marginLeft: 20,
        marginTop: 8,
    },
});
