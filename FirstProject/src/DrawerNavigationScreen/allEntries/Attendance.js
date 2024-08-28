import { Image, StyleSheet, Text, TouchableOpacity, View,FlatList} from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Attendance = ({ navigation, route }) => {
    const [item, setItem] = useState([]);


    const { id } = route.params;
    console.log('-------->here my Item', id);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://app.guardx.cloud/api/getMaidEntry');
            const data = response.data.data;

            // Check if data is an array
            if (data) {
                const filteredData = data.filter(entry => entry.guardId === id);
                setItem(filteredData);
                console.log('Filtered API Response--->:', filteredData);
            } else {
                console.error('API response is not an array:', data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
                <Text style={styles.headingtxt}>Attendance List</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '5%' }}>

                <View style={{ marginLeft: '4%' }}>
                    <TouchableOpacity style={styles.printButton}>
                        <Text style={styles.printButtonText}>Print</Text>
                        <Image
                            source={require('../../../assets/Image/printing.png')}
                            style={styles.printImage}
                        />
                    </TouchableOpacity>
                </View>


                <View style={{ marginRight: '4%' }}>
                    <Text style={{ fontSize: 33, color: 'black', fontWeight: '700' }}>Date Picker</Text>
                </View>
            </View>

            <View style={styles.headerContainer}>
                <View style={styles.headerRow}>
                    <View style={{ width: '13%', height: 30 }}>
                        <Text style={styles.headerText}>Name</Text>
                    </View>
                    <View style={{ width: '13%' }}>
                        <Text style={styles.headerText}>Clock IN</Text>
                    </View>
                    <View style={{ width: '13%' }}>
                        <Text style={styles.headerText}>Clock OUT</Text>
                    </View>

                    <View style={{ width: '13%' }}>
                        <Text style={styles.headerText}>Date</Text>
                    </View>

                    <View style={{ width: '13%' }}>
                        <Text style={styles.headerText}>Delete</Text>
                    </View>
                </View>
            </View>

            <FlatList
                data={item}
                //ListEmptyComponent={NoData}
                renderItem={({ item, index }) => {
                    console.log('---------------------------->', item)
                    return (
                        <View style={styles.itemContainer}>
                            <View style={{ width: 190 }}>
                                <Text style={[styles.itemText, { marginLeft: 5 }]}>
                                    {item.maidName}
                                </Text>
                            </View>


                            <View style={{ width: 100 }}>
                                <Text style={[styles.itemText, {}]}>
                                    {item.clockInTime}
                                </Text>
                            </View>

                            <View style={{ width: 170 }}>
                                <Text style={[styles.itemText, { marginLeft: 25 }]}>
                                    {item.clockOutTime}
                                </Text>
                            </View>

                            <View style={{ width: 170 }}>
                                <Text style={[styles.itemText, { marginLeft: 25 }]}>
                                    {item.submittedDate}
                                </Text>
                            </View>
                           


                            <View style={[styles.itemCenter]}>
                            
                                <TouchableOpacity onPress={() => handleDeleteData(item._id)} >
                                    <Image
                                        source={require('../../../assets/Image/delete1.png')}
                                        style={[styles.deleteIcon, { marginRight: 40 }]}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }}
            />
        </View>
    )
}

export default Attendance

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
    printButton: {
        width: 130,
        height: 60,
        backgroundColor: '#FAE0E0',
        elevation: 3,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    printButtonText: {
        fontSize: 22,
        color: '#000',
        fontWeight: '600',
    },
    printImage: {
        width: 25,
        height: 25,
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
    deleteIcon: {
        width: 30,
        height: 30,
        tintColor: 'black',
    },
    itemContainer: {
        width: '92%',
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: '4%',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        elevation: 2,
        borderRadius: 10,
    },
    itemImage: {
        width: 35,
        height: 35,
        //resizeMode: 'contain'
    },
    itemText: {
        textAlign: 'center',
        fontSize: 20,
        color: '#000',
        fontWeight: '500'
    },
    itemCenter: {
        width: 150,
       // backgroundColor: 'red',
     //   justifyContent: 'space-between',
        alignItems: 'center',
       // flexDirection: 'row',
    },
})