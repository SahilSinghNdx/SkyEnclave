import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, Button } from 'react-native'
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { all, Axios } from 'axios';
import { BASE_GUARD, DELETE_USER_NON_VERIFIED, GET_USER_NON_VERIFIED } from '../Config';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import DatePicker from 'react-native-date-picker';

const GetRequest = ({ navigation }) => {
    const [userID, setUserID] = useState(null);
    const [entries, setEntries] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [filteredDataAPI, setFilteredDataAPI] = useState([]);
    const [Time, setTime] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(new Date())

    // console.log(entries, 'all Data')


    const fetchDataAndUserID = async () => {
        try {
            // Fetch User ID from AsyncStorage
            const storedUserID = await AsyncStorage.getItem('userID');
            if (storedUserID) {
                console.log('UserID mere pass yeh aa rhi h------------->', storedUserID);
                setUserID(storedUserID);

                // Fetch data from the API
                const response = await axios.get(GET_USER_NON_VERIFIED);
                if (response.data.success) {
                    const allEntries = response.data.data;
                  //  console.log('All Entries from API:', allEntries);

                    // Filter entries based on the User ID
                    let filteredEntries = allEntries.filter(entry => entry.society_id === storedUserID);

                    setEntries(filteredEntries);
                    setFilteredData(filteredEntries);
                    setFilteredDataAPI(filteredEntries);
                }
            }
        } catch (error) {
            console.error('Error fetching data or user ID:', error);
        }
    };

    useEffect(() => {
        fetchDataAndUserID();
    }, []);



    const openModal = (entry) => {
        setSelectedEntry(entry);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedEntry(null);
        setModalVisible(false);
    };


    const NoData = () => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '10%' }}>
                <Text style={{ color: 'black', fontSize: 33 }}>No Data Found</Text>
            </View>
        )
    }

    const handleDeleteEntry = async (delete_id) => {
        console.log('----------------->newdelete id',delete_id)
        try {
            const response = await axios.delete(`${DELETE_USER_NON_VERIFIED}/${delete_id}`);
            if (response.data.msg) {
                console.log('Entry deleted successfully:', delete_id);
                fetchDataAndUserID();
            } else {
                console.error('Delete operation failed:', response.data.msg);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
        const filtered = filteredDataAPI.filter(item =>
            item.entryType && item.entryType.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const generatePDF = async () => {
        if (filteredData.length === 0) {
            console.log('No data to export');
            return;
        }

        const htmlContent = `
        <html>
            <head>
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    th, td {
                        border: 1px solid #dddddd;
                        text-align: left;
                        padding: 8px;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h1 style="text-align: center;">Guest Entries Requests</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Entry Type</th>
                            <th>Purpose Type</th>
                            <th>House Details</th>
                            <th>Date</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredData
                .map(
                    (item) => `
                                    <tr>
                                        <td>${item.entryType}</td>
                                        <td>${item.purposeType}</td>
                                        <td>House No: ${JSON.parse(item.houseDetails).houseNo}, Owner: ${JSON.parse(item.houseDetails).owner}</td>
                                        <td>${item.submitedDate}</td>
                                        <td>${item.submitedTime}</td>
                                    </tr>
                                `
                )
                .join('')}
                    </tbody>
                </table>
            </body>
        </html>
    `;

        console.log('HTML Content:', htmlContent); // Log HTML content to check its structure

        try {
            let options = {
                html: htmlContent,
                fileName: 'guest_entries_requests',
                directory: 'Downloads',
            };

            console.log('Generating PDF with options:', options); // Log options to check before generating

            const file = await RNHTMLtoPDF.convert(options);
            console.log('PDF generated:', file.filePath);
            alert('PDF generated successfully!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF.');
        }
    };




    return (
        <View style={styles.mainContianer}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image source={require('../../assets/Image/back.png')} style={styles.backImage} />

                </TouchableOpacity>
                <Text style={styles.headingtxt}>Guest Entries Requests</Text>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <TextInput value={searchQuery}
                        onChangeText={handleSearch} placeholder='Search Here...' placeholderTextColor={'#8e8e8e'} style={styles.searchInput} />

                </View>



                <View style={{
                    backgroundColor: 'red', alignItems: 'center', width: '25%', marginRight: '10%'
                    // justifyContent: 'center',
                }}>



                    <DatePicker
                        style={{ width: 300, height: 150 }}
                        open={open}
                        date={Time}
                        onDateChange={setTime}
                        dateFormat="DD-MM-YYYY"
                        mode='date'
                        textColor="#8831CD"
                        theme="auto"
                    />
                </View>

                <View style={{ marginRight: '4%' }}>
                    <TouchableOpacity onPress={generatePDF} style={styles.printButton}>
                        <Text style={styles.printButtonText}>Print</Text>
                        <Image source={require('../../assets/Image/printing.png')} style={styles.printImage} />
                    </TouchableOpacity>
                </View>
            </View>


            <View style={styles.headerContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.headerText}>Entry Type</Text>
                    <Text style={styles.headerText}>Purpose Type</Text>
                    <Text style={styles.headerText}>House Details</Text>
                    <Text style={styles.headerText}>Images</Text>
                    <Text style={styles.headerText}>Date</Text>
                    <Text style={styles.headerText}>Time</Text>
                    <Text style={styles.headerText}>Actions</Text>
                </View>
            </View>

            <FlatList
                data={filteredData}

                ListEmptyComponent={NoData}


                renderItem={({ item }) => {
                  
                    return (
                        <View style={styles.itemContainer}>
                            <View style={{ width: 120 }}>
                                <Text style={[styles.itemText, { marginLeft: '3%' }]}>{item.entryType}</Text>

                            </View>
                            <View style={{ width: 120 }}>
                                <Text style={styles.itemText}>{item.purposeType}</Text>

                            </View>
                            <View style={[styles.itemHouseDetails, { width: 200 }]}>
                                <Text style={styles.itemText}>House No: {item.houseNo }</Text>
                                <Text style={styles.itemText}>Owner: {item.owner}</Text>
                            </View>
                            <TouchableOpacity onPress={() => openModal(item)} style={[styles.itemCenter, {}]}>
                                <Text style={styles.itemText}>View</Text>
                                <Image source={require('../../assets/Image/eyes.png')} style={{ width: 20, height: 20 }} />
                            </TouchableOpacity>

                            <View style={{ width: 110 }}>
                                <Text style={styles.itemText}>{item.submitedDate}</Text>

                            </View>

                            <View style={{}}>
                                <Text style={[styles.itemText, { marginRight: 40 }]}>{item.submitedTime}</Text>

                            </View>
                            <View style={styles.itemCenter}>
                                <TouchableOpacity onPress={() => handleDeleteEntry(item._id)}>
                                    <Image source={require('../../assets/Image/delete1.png')} style={styles.deleteIcon} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }}

            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={closeModal}>
                            <Image source={require('../../assets/Image/close.png')} style={{ width: 30, height: 30 }} />

                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>View Details</Text>
                        <View style={{ marginTop: '5%' }}>
                            {selectedEntry && (

                                <>
                                    <View>
                                        <Text style={{ fontSize: 22, color: '#000', fontWeight: '500', textAlign: 'center' }}>Adhaar Card Image</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', padding: 10, margin: 15 }}>
                                        {selectedEntry.adharImg.map((imgUrl, index) => (
                                            <View style={{ marginHorizontal: 10 }}>
                                                <Image
                                                    key={index}
                                                    source={{ uri: `${BASE_GUARD}/${imgUrl.replace(/^public\//, '')}` }}
                                                    style={styles.modalImage}
                                                />
                                            </View>
                                        ))}

                                    </View>

                                    <Text style={{ fontSize: 22, color: '#000', fontWeight: '500', textAlign: 'center' }}>User Image</Text>

                                    <View style={{ flexDirection: 'row', padding: 10, margin: 15 }}>
                                        {selectedEntry.image.map((imgUrl, index) => (
                                            <View style={{ marginHorizontal: 10 }}>
                                                <Image
                                                    key={index}
                                                    source={{ uri: `${BASE_GUARD}/${imgUrl.replace(/^public\//, '')}` }}
                                                    style={styles.modalImage}
                                                />
                                            </View>

                                        ))}

                                    </View>


                                </>
                            )}
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default GetRequest;

const styles = StyleSheet.create({
    mainContianer: { flex: 1, backgroundColor: '#fff' },
    headingtxt: {
        fontSize: 42, color: '#000', fontWeight: '600'
    },
    header: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '70%',
    },
    backButton: {
        marginLeft: '5%'
    },
    backImage: {
        width: 60,
        height: 40
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '5%',
        width: '100%',
        // alignSelf: 'center'
    },
    searchBox: {
        width: '20%', height: 60, borderWidth: 2, borderColor: '#8e8e8e', borderRadius: 8, marginLeft: '4%', alignItems: 'center'
    },
    searchInput: {
        width: '90%',
        height: 50,
        color: '#000',
        fontSize: 20,
        // alignSelf: 'center'
    },
    printButton: {
        width: 130,
        height: 60,
        backgroundColor: '#FAE0E0',
        elevation: 3,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    printButtonText: {
        fontSize: 22,
        color: '#000',
        fontWeight: '600'
    },
    printImage: {
        width: 30,
        height: 30
    },
    entryTxt: {
        fontSize: 19, color: '#000', fontWeight: '500'
    },
    headerContainer: {
        width: '92%',
        height: 60,
        backgroundColor: '#FA8D8D',
        borderRadius: 10,
        marginTop: '8%',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: '3%',
        paddingRight: '3%'
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
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
    deleteIcon: {
        width: 30,
        height: 30,
        tintColor: 'black'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '60%',
        padding: '4%',
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000'
    },
    modalImage: {
        width: 150, height: 100
    },

})