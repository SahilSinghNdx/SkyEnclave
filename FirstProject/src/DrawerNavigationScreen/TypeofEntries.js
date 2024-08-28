import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    TextInput,
    FlatList,
    Modal,
    ActivityIndicator
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import axios, { Axios } from 'axios';
import { BASE_GUARD, BASE_URL, DELETE_PARTICULAR_ID, GET_ENTRIES, GET_PARTICULAR_ID, POST_ENTRY } from '../Config';
import CommonTxtInput from '../Component/CommonTxtInput';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RadioButton } from 'react-native-paper';


const Logo = require('../../assets/Image/image1.png');

const TypeofEntries = ({ navigation }) => {

    const [selectedData, setSelectedData] = useState([]);
    const [getEntries, setGetentries] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState(null);

    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDataAPI, setFilteredDataAPI] = useState([]);

    const [filePath, setFilePath] = useState();
    console.log("image we care sending --> ", filePath);
    const [EditFilePath, SetEditfilePath] = useState();
    const [editModalImage, setEditModalImage] = useState();
    console.log('online image getting --> ', editModalImage)
    const [EditCheck, setEditChecked] = useState()
    // console.log('editModalImage:', editModalImage);
    // console.log('Image URL:', `${BASE_GUARD}${editModalImage.replace(/^public\//, '')}`);



 const [hinditext, setHindiText] = useState('');
    const [errorHindiText, setErrorHindiText] = useState('');
    const [english, setEnglish] = useState('');

    const [errorEnglishText, setErrorEnglishText] = useState('');
    const [errorEntryType, setErrorEntryType] = useState('');
    const [errorEditEntryType, setErrorEditEntryType] = useState('');

    const [editModalVisible, setEditModalVisible] = useState(false);

    const [titleEnglish, setTitleEnglish] = useState('');
    const [titleHindi, setTitleHindi] = useState('');
    const [checked, setChecked] = useState(null);
    const [userId, setUserID] = useState()
    const [uploadInProgress, setUploadInProgress] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [imageUpload, setImageUpload] = useState('')

    const [modalId, setModalId] = useState('')


    const fetchData = async () => {
        try {
            const storedSocietyID = await AsyncStorage.getItem('userID');

            if (!storedSocietyID) {
                console.error('No society ID found in AsyncStorage');
                return; // If there's no stored society ID, return early
            }

            console.log('Stored Society ID:', storedSocietyID);

            const response = await axios.get(GET_ENTRIES);
            if (response.data.success) {
                const allData = response.data.data; // Access the actual data array
              //  console.log('All Data------------>:', allData);
                setGetentries(allData);

                const filter = allData.filter(item => item.society_id === storedSocietyID);
                setFilteredDataAPI(filter);
                setFilteredData(filter)

                // Log filtered data for debugging
               // console.log('Filtered Data---------------->:', filter);
            } else {
                console.error('Failed to fetch data:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);



    const handleSearch = (text) => {
        setSearchQuery(text);
        const filtered = filteredDataAPI.filter(item =>
            item.titleEnglish && item.titleEnglish.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const handleImagePicker = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
        };
        setUploadInProgress(true);

        launchCamera(options, response => {
            setUploadInProgress(false);
            if (response.didCancel) {
                // User cancelled image picker
            } else if (response.error) {
                // Handle error
            } else {
                const imageUri = response.assets?.[0]?.uri || response.uri;
                setFilePath(imageUri);
            }
        });
    };




    const handleDeleteImage = () => {
        setEditModalImage(null); 
        setFilePath(null)
    };



    const handleItemClick = (item) => {
        console.log('MOdal item is here -------------------->', item)
        setSelectedItem(item); // Set selected item to state
        setTitleEnglish(item.titleEnglish); // Populate titleEnglish field
        //  setTitleHindi(item.titleHindi);
        setEditModalImage(item.icon);
        setEditChecked(item.entryType)
        openEditModall()
        setModalId(item._id)
    };

    const closeEditModal = () => {
        console.log("closing the modal");
        setFilePath(null);
        console.log("check the state ---> ", filePath);
        setEditModalVisible(false)
    }

    const openEditModall = () => {
        setEditModalVisible(true)
    }




    const updateEntry = async () => {
        console.log("hello user this is new data --> ", titleEnglish, editModalImage, EditCheck);
        const formData = {
            "titleEnglish": titleEnglish,
            //"icon": editModalImage,
            "entryType": EditCheck,
            
            if(editModalImage) {
                formData.append('icon', {
                    uri: editModalImage,
                    type: 'image/jpeg',
                    name: 'icon.jpg',
                });
            }
        }

        console.log('------------------------------------------->', formData)
        try {
            const response = await axios.put(`https://app.guardx.cloud/api/editEntry/${modalId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Upload response: is here --> ', response.data);
            fetchData()
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDeleteEntry = async (delete_id) => {
        // console.log(delete_id, '------------------>')
        try {
            const response = await axios.delete(`${DELETE_PARTICULAR_ID}/${delete_id}`);
            if (response.data.msg) {
                // Assuming fetchData() updates the state with the updated data
                fetchData();
            } else {
                console.error('Delete operation failed:', response.data.msg);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    }


    const validateFields = () => {
        let isValid = true;



        if (!english) {
            setErrorEnglishText('Please fill text in English.');
            isValid = false;
        }
        if (!checked) {
            setErrorEntryType('Please select an entry type');
            isValid = false;
        } else {
            setErrorEntryType('');
        }
        return isValid;
    };

    const handleAddNewEntries = async () => {
        if (validateFields()) {
            const formData = new FormData();
            //  formData.append('titleHindi', hinditext);
            formData.append('titleEnglish', english);
            formData.append('icon', {
                uri: filePath,
                type: 'image/jpeg',
                name: 'icon.jpg',
            });


            formData.append('entryType', checked);

            try {
                const societyID = await AsyncStorage.getItem('userID');
                const createdByID = await AsyncStorage.getItem('userID');
                if (societyID) {
                    formData.append('society_id', societyID);
                } else {
                    console.error('No society ID found in AsyncStorage');
                } if (createdByID) {
                    formData.append('createdBy', createdByID);
                } else {
                    console.error('No createdBy ID found in AsyncStorage');
                }
            } catch (error) {
                console.error('Error retrieving society ID from AsyncStorage:', error);
            }

            try {
                const response = await axios.post(POST_ENTRY, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log('Upload response:', response.data);

                setModalVisible(false);
                //     setHindiText('');
                setEnglish('');
                setFilePath('');
                setSelectedTab(0);
                setChecked(null);


                fetchData();
                return response.data;

            } catch (error) {
                console.error('Error uploading formData:', error);
                throw error;
            }
        }
    };

    const handleEntryTypeSelection = (value) => {
        setChecked(value);
        if (value) {
            setErrorEntryType('');
        }
    };

    const handleEntryEditTypeSelection = (type) => {
        setEditChecked(type);
    };
    const resetFields = () => {
        //   setHindiText('');
        //     setErrorHindiText('');
        setEnglish('');
        setErrorEnglishText('');
        setChecked(null);
        setErrorEntryType('');
        setFilePath('');
    };

    const handleCloseModalAdd = () => {
        setModalVisible(false);
        resetFields();
    };

    const NoData = () => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '10%' }}>
                <Text style={{ color: 'black', fontSize: 33 }}>No Data Found</Text>
            </View>
        )
    }

    return (
        <View style={styles.mainContianer}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}>
                    <Image
                        source={require('../../assets/Image/back.png')}
                        style={styles.backImage}
                    />
                </TouchableOpacity>
                <Text style={styles.headingtxt}>Type of Entries</Text>
            </View>

            <View style={styles.searchContainer}>
                <View
                    style={{
                        width: '40%',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                    }}>
                    <View style={styles.searchBox}>
                        <TextInput
                            placeholder="Search Here..."
                            placeholderTextColor={'#8e8e8e'}
                            style={styles.searchInput}
                            value={searchQuery}
                            onChangeText={handleSearch}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={{
                            width: 130,
                            height: 55,
                            backgroundColor: '#FA8D8D',
                            borderRadius: 8,
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                        }}>
                        <Text style={{ fontSize: 25, color: '#fff', fontWeight: '600' }}>
                            Add
                        </Text>
                        <Image
                            source={require('../../assets/Image/adddata.png')}
                            style={[styles.printImage, { tintColor: '#fff' }]}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ marginRight: '4%' }}>
                    <TouchableOpacity style={styles.printButton}>
                        <Text style={styles.printButtonText}>Print</Text>
                        <Image
                            source={require('../../assets/Image/printing.png')}
                            style={styles.printImage}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.headerContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.headerText}>Entry</Text>
                    <Text style={styles.headerText}>Entry Logo</Text>
                    <Text style={styles.headerText}>Joining Date</Text>
                    <Text style={styles.headerText}>Type Entries</Text>
                    <Text style={styles.headerText}>Actions</Text>
                </View>
            </View>

            <FlatList
                data={filteredData}
                ListEmptyComponent={NoData}

                keyExtractor={item => item._id} // Ensure each item has a unique key
                renderItem={({ index, item }) => {
                    const entryTypeInitial = item.titleEnglish
                        ? item.titleEnglish.charAt(0).toUpperCase()
                        : '';

                    // console.log(`Item ${index}: ${item.titleEnglish} - Initial: ${entryTypeInitial}`); // Debugging line
// console.log('44444444444444',item)
                    return (
                        <View style={styles.itemContainer}>
                            <View style={{ width: 120 }}>
                                <Text style={[styles.itemText, { marginLeft: '3%' }]}>
                                    {item.titleEnglish}
                                </Text>
                            </View>
                            <View style={{ marginTop: -10, marginLeft: -15 }}>
                                <Text style={styles.itemText}>{item.purposeType}</Text>
                                {item.icon && item.icon.trim() !== '' ? (
                                    <Image
                                        source={{
                                            uri: `${BASE_GUARD}/${item.icon.replace(
                                                /^public\//,
                                                '',
                                            )}`,
                                        }}
                                        style={styles.itemImage}
                                    />
                                ) : (
                                    <View style={styles.placeholderContainer}>
                                        <Text style={styles.placeholderText}>
                                            {entryTypeInitial}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <View style={{ width: 120 }}>
                                <Text style={[styles.itemText, { marginLeft: '3%' }]}>
                                    {item.joiningDate}
                                </Text>
                            </View>
                            <View style={{ width: 120 }}>
                                <Text style={[styles.itemText, { marginLeft: '3%' }]}>
                                    {item.entryType}
                                </Text>
                            </View>
                            <View style={[styles.itemCenter, { marginRight: '2%' }]}>
                                <TouchableOpacity onPress={() => handleItemClick(item)}>
                                    <Image
                                        source={require('../../assets/Image/Edit1.png')}
                                        style={styles.deleteIcon}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => handleDeleteEntry(item._id)}>
                                    <Image
                                        source={require('../../assets/Image/delete1.png')}
                                        style={[styles.deleteIcon, { marginLeft: 10 }]}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                }}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModalAdd}
                onShow={resetFields}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            onPress={handleCloseModalAdd}
                            style={{
                                alignSelf: 'flex-end',
                                marginRight: '5%',
                                marginTop: '4%',
                            }}>
                            <Image
                                source={require('../../assets/Image/close.png')}
                                style={{ width: 30, height: 30 }}
                            />
                        </TouchableOpacity>

                        <Text
                            style={{
                                fontSize: 32,
                                color: '#000',
                                fontWeight: '600',
                                textAlign: 'center',
                            }}>
                            Add Entries
                        </Text>

                        <View style={{ width: '100%', marginTop: '5%', marginLeft: '5%' }}>
                            {/* <View>
                                <Text style={{ fontSize: 22, color: '#000' }}>
                                    Add Entries in Hindi*
                                </Text>
                                <CommonTxtInput
                                    placeholder={'Enter Hindi Text Here..'}
                                    value={hinditext}
                                    onChangeText={validateHindiText}
                                    style={[styles.input, errorHindiText && styles.inputError]}
                                    autoFocus
                                />
                                {errorHindiText ? (
                                    <Text style={styles.errorText}>{errorHindiText}</Text>
                                ) : null}
                            </View> */}

                            <View style={{}}>
                                <Text style={{ fontSize: 22, color: '#000' }}>
                                    Add Entries in English*
                                </Text>
                                <CommonTxtInput
                                    placeholder={'Enter English Text Here..'}
                                    value={english}
                                    onChangeText={txt => {
                                        setEnglish(txt);
                                        if (txt) setErrorEnglishText('');
                                    }}
                                />
                                {errorEnglishText ? (
                                    <Text style={styles.errorText}>{errorEnglishText}</Text>
                                ) : null}
                            </View>

                            <View style={{ marginTop: '3%' }}>
                                <Text style={{ fontSize: 22, color: '#000' }}>Image*</Text>
                                <TouchableOpacity
                                    onPress={() => handleImagePicker('filePath')}
                                    style={{
                                        width: 150,
                                        height: 150,
                                        borderWidth: 1,
                                        marginTop: 10,
                                        borderStyle: 'dashed',
                                        borderRadius: 10,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    {filePath == '' ? (
                                        <Image source={Logo} style={{ width: 55, height: 55 }} />
                                    ) : (
                                        <View>
                                            <Image
                                                source={{ uri: filePath }}
                                                style={{ width: 100, height: 100, borderRadius: 10 }}
                                            />
                                            <View style={styles.modalDelete}>
                                                <TouchableOpacity
                                                    onPress={() => handleDelete(null, 'filePath')}>
                                                    <Image
                                                        source={require('../../assets/Image/close.png')}
                                                        style={{ width: 25, height: 25 }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                                    <RadioButton
                                        value="Regular"
                                        status={checked === 'Regular' ? 'checked' : 'unchecked'}
                                        onPress={() => handleEntryTypeSelection('Regular')}
                                    />
                                    <Text style={{ fontSize: 16, color: 'black' }}>Regular</Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <RadioButton
                                        value="Occasional"
                                        status={checked === 'Occasional' ? 'checked' : 'unchecked'}
                                        onPress={() => handleEntryTypeSelection('Occasional')}
                                    />
                                    <Text style={{ fontSize: 16, color: 'black' }}>Occasional</Text>
                                </View>
                            </View>
                            {errorEntryType ? (
                                <Text style={styles.errorText}>{errorEntryType}</Text>
                            ) : null}

                            <TouchableOpacity
                                onPress={handleAddNewEntries}
                                style={{
                                    width: '49%',
                                    height: 60,
                                    marginTop: 30,
                                    backgroundColor: '#f64f6d',
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <Text style={{ fontSize: 22, color: '#fff', fontWeight: '600' }}>
                                    Add New Entries
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            onPress={() => closeEditModal()}
                            style={{
                                alignSelf: 'flex-end',
                                marginRight: '5%',
                                marginTop: '4%',
                            }}>
                            <Image
                                source={require('../../assets/Image/close.png')}
                                style={{ width: 30, height: 30 }}
                            />
                        </TouchableOpacity>

                        <Text
                            style={{
                                fontSize: 33,
                                color: '#000',
                                fontWeight: '700',
                                textAlign: 'center',
                                // marginTop: 10,
                            }}>
                            Edit Entries
                        </Text>
                        <View style={{ marginLeft: '6%' }}>
                            <View style={{ marginTop: '3%' }}>
                                <Text style={{ fontSize: 22, color: '#000' }}>
                                    Entry English*
                                </Text>
                                <CommonTxtInput placeholder={'Enter English Text Here..'} value={titleEnglish}
                                    onChangeText={text => setTitleEnglish(text)} />
                            </View>


                            <View
                                style={{
                                    width: 150,
                                    height: 150,
                                    borderWidth: 1,
                                    marginTop: '5%',
                                    borderStyle: 'dashed',
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {filePath ? (
                                    <View style={{ position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            source={{ uri: filePath }}
                                            resizeMode="contain"
                                            style={{ width: 100, height: 100 }}
                                        />
                                        <View style={[styles.modalDelete, { position: 'absolute', top: 5, right: 5 }]}>
                                            <TouchableOpacity onPress={handleDeleteImage}>
                                                <Image
                                                    source={require('../../assets/Image/close.png')}
                                                    style={{ width: 25, height: 25 }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ) : editModalImage ? (

                                    <View style={{ alignItems: 'center' }}>
                                        <Image
                                            source={{ uri: `${BASE_GUARD}/${editModalImage.replace(/^public\//, '')}` }}

                                            resizeMode='contain'
                                            style={{ width: 100, height: 100 }}
                                        />
                                        <View style={styles.modalDelete}>
                                            <TouchableOpacity onPress={handleDeleteImage}>
                                                <Image
                                                    source={require('../../assets/Image/close.png')}
                                                    style={{ width: 25, height: 25 }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ) : (
                                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => handleImagePicker('EditFilePath')}>
                                        {uploadInProgress ? (
                                            <ActivityIndicator color="#f64f6d" size="small" />
                                        ) : (
                                            <>
                                                <Image
                                                    source={require('../../assets/Image/upload.png')}
                                                    style={{ width: 55, height: 55 }}
                                                />
                                                <Text style={{ fontSize: 16, marginTop: 10 }}>Upload an image</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                )}

                            </View>







                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                                    <RadioButton
                                        value="Regular"
                                        status={EditCheck === 'Regular' ? 'checked' : 'unchecked'}
                                        onPress={() => handleEntryEditTypeSelection('Regular')}
                                    />
                                    <Text style={{ fontSize: 16, color: 'black' }}>Regular</Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <RadioButton
                                        value="Occasional"
                                        status={EditCheck === 'Occasional' ? 'checked' : 'unchecked'}
                                        onPress={() => handleEntryEditTypeSelection('Occasional')}
                                    />
                                    <Text style={{ fontSize: 16, color: 'black' }}>Occasional</Text>
                                </View>
                            </View>

                            {errorEntryType ? (
                                <Text style={styles.errorText}>{errorEntryType}</Text>
                            ) : null}



                            <TouchableOpacity
                                onPress={() => { updateEntry(), setEditModalVisible(false) }}
                                style={{
                                    width: '49%',
                                    height: 60,
                                    marginTop: 30,
                                    backgroundColor: '#f64f6d',
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <Text style={{ fontSize: 22, color: '#fff', fontWeight: '600' }}>
                                    Update
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


        </View>
    );
};

export default TypeofEntries;

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
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '5%',
        width: '100%',
        // alignSelf: 'center'
    },
    searchBox: {
        width: '50%',
        height: 60,
        borderWidth: 2,
        borderColor: '#8e8e8e',
        borderRadius: 8,
        marginLeft: '4%',
        alignItems: 'center',
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
    itemText: {
        textAlign: 'center',
        fontSize: 17,
        color: '#000',
        fontWeight: '500',
    },
    modalImage: {
        resizeMode: 'contain',
        width: 10,
        height: 10,
    },
    placeholderContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccc',
        borderRadius: 25,
        //marginTop: 10,
    },
    placeholderText: {
        fontSize: 24,
        color: '#fff',
    },
    itemCenter: {
        width: '7%',
        // backgroundColor: 'red',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    deleteIcon: {
        width: 30,
        height: 30,
        tintColor: 'black',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '60%',
        // padding: '4%',
        height: 800,
        backgroundColor: '#fff',
        borderRadius: 10,
        //alignItems: 'center',
    },
    modalTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000',
    },
    modalImage: {
        width: 150,
        height: 100,
    },
    inputError: {
        color: 'red',
    },
    modalDelete: {
        position: 'absolute',
        right: -10
        //left: 25
        // marginLeft: 15,
    },
    itemImage: {
        width: 100,
        height: 100,
        //resizeMode: 'contain'
    },
    inputError: {
        borderColor: 'red',
        borderWidth: 1,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 2,
    },
});
