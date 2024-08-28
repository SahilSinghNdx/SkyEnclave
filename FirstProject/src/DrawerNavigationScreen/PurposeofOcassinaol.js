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
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_GUARD, GET_PARTICULAR_PURPOSE, GET_PURPOSE, POST_NONPURPOSE,DELETE_PURPOSE } from '../Config';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CommonTxtInput from '../Component/CommonTxtInput';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Logo = require('../../assets/Image/image1.png');

const PurposeofOcassinaol = ({ navigation }) => {

    const fetchData = async () => {
        try {
            // Fetch User ID from AsyncStorage
            const storedUserID = await AsyncStorage.getItem('userID');
            if (storedUserID) {
                setUserID(storedUserID);

                // Fetch data from the API
                const response = await axios.get(GET_PURPOSE);
                if (response.data.success) {
                    // Filter data based on userID and society_id
                    const filteredPurposes = response.data.data.filter(item => item.society_id === storedUserID);
                    setGetPurposes(filteredPurposes);
                    setFilteredData(filteredPurposes);

                   // console.log('Filtered Data:', filteredPurposes);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData()
    }, []);


    const [getPurpose, setGetPurposes] = useState([])
    const [userID, setUserID] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [EditmodalVisible, setEditModalVisible] = useState(false);
    const [filePath, setFilePath] = useState('');
    const [EditFilePath, SetEditfilePath] = useState();
    const [images, setImages] = useState([]);
    const [editImages, setEditImages] = useState([]);

    const [english, setEnglish] = useState('');
    const [titleEnglish, setTitleEnglish] = useState('');

    const [errorEnglishText, setErrorEnglishText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [editModalImage, setEditModalImage] = useState();
    const [modalId, setModalId] = useState('')
    const [uploadInProgress, setUploadInProgress] = useState(false);



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
    
    const handleDelete = (index, type) => {
        if (type === 'image') {
            let updatedImages = images.filter((img, i) => i !== index);
            setImages(updatedImages);
        } else if (type === 'filePath') {
            setFilePath('');
        }
    };


    

    const validateFields = () => {
        let isValid = true;

    
        if (!english) {
            setErrorEnglishText('Please fill text in English.');
            isValid = false;
        }


        return isValid;
    };

    const handleAddNewEntries = async () => {
        console.log('Add Purpose button pressed');
        try {
            if (validateFields()) {
                console.log('Data will completely filled');
                const formData = new FormData();
                formData.append('purpose', english);

                console.log('Purpose:', english);

                // Append image file if filePath exists
                if (filePath) {
                    formData.append('purposeIcon', {
                        uri: filePath,
                        type: 'image/jpeg',
                        name: 'icon.jpg',
                    });
                    console.log('File Path:', filePath);
                } else {
                    console.log('No file path provided');
                }

                // Retrieve the user ID from AsyncStorage
                const societyID = await AsyncStorage.getItem('userID');
                if (societyID) {
                    formData.append('society_id', societyID);
                    console.log('Society ID:', societyID);
                } else {
                    console.error('No society ID found in AsyncStorage');
                    return; // Exit function or handle accordingly
                }

                const response = await axios.post(POST_NONPURPOSE, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log('Upload response:', response.data);

                if (response.data.success) {
                    // Clear input fields and update UI
                    setModalVisible(false);
                    setEnglish('');
                    setFilePath('');
                    fetchData(); // Refresh data after successful upload
                } else {
                    console.error('Failed to add new entries:', response.data.message);
                }

                return response.data;
            }
        } catch (error) {
            console.error('Error uploading formData:', error);
            throw error;
        }
    };

    const updateEntry = async () => {
        console.log("hello user this is new data --> ", titleEnglish, editModalImage);
        const formData = {
            "purpose": titleEnglish,
            "purposeIcon": editModalImage,
           

        }

        console.log('------------------------------------------->', formData)
        try {
            const response = await axios.put(`https://app.guardx.cloud/api/updatePurpose/${modalId}`, formData, {
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

    const handleSearch = (text) => {
        setSearchQuery(text);
        const filtered = getPurpose.filter(item =>
            item.purpose && item.purpose.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const handleItemClick = (item) => {
        console.log('MOdal item is here -------------------->', item)
        setSelectedItem(item); // Set selected item to state
        setTitleEnglish(item.purpose); // Populate titleEnglish field
        setEditModalImage(item.purposeIcon);
        openEditModall()
        setModalId(item._id)
    };


    const resetFields = () => {
       setEnglish('');
       setFilePath('')
    };

    const closeModal=()=>{
        setModalVisible(false);
        resetFields()
    }

    const openEditModall = () => {
        setEditModalVisible(true)
    }
    const handleDeleteImage = () => {
        setEditModalImage(null);
         setFilePath(null)
    };


    const handleDeleteEntry = async (delete_id) => {
        console.log(delete_id, '------------------>')
        try {
            const response = await axios.delete(`${DELETE_PURPOSE}/${delete_id}`);
            if (response.data.message) {
                console.log('successfully Added:', response.data.message);
                fetchData();
            } else {
                console.error('Delete operation failed:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    }

    const closeEditModal = () => {
        console.log("closing the modal");
        setFilePath(null);
        console.log("check the state ---> ", filePath);
        setEditModalVisible(false)
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
                <Text style={styles.headingtxt}>Type of Purpose</Text>
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
                    <View style={{ width: '40%', height: 30 }}>
                        <Text style={styles.headerText}>Purpose Type</Text>
                    </View>
                    <View style={{ width: '20%' }}>
                        <Text style={styles.headerText}>Purpose Image</Text>
                    </View>
                    <View style={{ width: '20%' }}>
                        <Text style={styles.headerText}>Action</Text>
                    </View>
                </View>
            </View>

            <FlatList
                data={filteredData}
                renderItem={({ index, item }) => {


                    return (
                        <View style={styles.itemContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                <View style={{ width: '40%' }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={[styles.itemText, { marginLeft: '3%' }]}>{item.purpose}</Text>
                                    </View>
                                </View>

                                <View style={{ width: '30%', alignItems: 'center' }}>
                                    {item.purposeIcon ? (
                                        <Image
                                            source={{ uri: `${BASE_GUARD}/${item.purposeIcon.replace(/^public\//, '')}` }}
                                            style={styles.itemImage}
                                        />
                                    ) : (
                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={styles.itemText}>Image not added</Text>
                                        </View>
                                    )}
                                </View>


                                <View style={{ width: '20%', marginRight: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                    <TouchableOpacity onPress={() => handleItemClick(item)}>
                                        <Image source={require('../../assets/Image/Edit1.png')} style={[styles.deleteIcon, { marginLeft: 70 }]} />

                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDeleteEntry(item._id)}>
                                        <Image source={require('../../assets/Image/delete1.png')} style={[styles.deleteIcon, { marginRight: 70 }]} />

                                    </TouchableOpacity>
                                </View>

                            </View>


                        </View>
                    );
                }}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
                onShow={resetFields}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            onPress={closeModal}
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
                            Add Purpose
                        </Text>

                        <View style={{ width: '100%', marginTop: '5%', marginLeft: '5%' }}>
                           

                            <View style={{ marginTop: '3%' }}>
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
                                    Add Purpose
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={EditmodalVisible}
               >
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
                                fontSize: 32,
                                color: '#000',
                                fontWeight: '600',
                                textAlign: 'center',
                            }}>
                            Edit Purpose
                        </Text>

                        <View style={{ width: '100%', marginTop: '5%', marginLeft: '5%' }}>
                            

                            <View style={{ marginTop: '3%' }}>
                                <Text style={{ fontSize: 22, color: '#000' }}>
                                    Add Entries in English*
                                </Text>
                                <CommonTxtInput
                                    placeholder={'Enter English Text Here..'}
                                    value={titleEnglish}
                                    onChangeText={text => setTitleEnglish(text)}
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
                                </TouchableOpacity>
                            </View>


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
                                    Edit Purpose
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default PurposeofOcassinaol;

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
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: '4%',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        elevation: 2,
        borderRadius: 10
    },
    itemText: {
        textAlign: 'center',
        fontSize: 20,
        color: '#000',
        fontWeight: '500'
    },
    itemImage: {  // Updated style reference
        width: 40,  // Adjust size as needed
        height: 40,  // Adjust size as needed
        //resizeMode: 'contain'
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
        top: 10,
        right: 10
        //left: 25
        // marginLeft: 15,
    },
    itemImage: {
        width: 35,
        height: 35,
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
