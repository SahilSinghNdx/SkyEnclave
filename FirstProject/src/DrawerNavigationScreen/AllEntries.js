import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, FlatList, Modal, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BASE_GUARD, DELETE_GETVERIFYMAID, GET_GETVERIFYMAID, POST_GETVERIFYMAID } from '../Config';
import axios from 'axios';
import CommonTxtInput from '../Component/CommonTxtInput';
import { Dropdown } from 'react-native-element-dropdown';
import { launchCamera } from 'react-native-image-picker';
import { useFocusEffect } from '@react-navigation/native';


const Logo = require('../../assets/Image/image1.png');

const AllEntries = ({ route, navigation }) => {
    const { titleEnglish, id } = route.params;
    // console.log('check krna kuch aaya ke nhi', titleEnglish)
    // console.log('check krna kuch aaya ke nhi', id)
    // console.log("Id of user is --> ", id);


    const [regular, setRegular] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedHouse, setSelectedHouse] = useState(null);
    const [AddmodalVisible, setAddModalVisible] = useState(false);
    const [EditmodalVisible, setEditModalVisible] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [ownerNameEng, setOwnerNameEng] = useState('');
    const [errorEnglishText, setErrorEnglishText] = useState('');
    const [address, setAddress] = useState('');
    const [addressError, setAddressError] = useState('');
    const [gender, setGender] = useState('');
    const [genderError, setGenderError] = useState('');
    const [aadhaarNo, setAadhaarNo] = useState('');
    const [aadhaarError, setAadhaarError] = useState('');
    const [filePath, setFilePath] = useState('');
    const [EditFilePath, setEditFilePath] = useState('');
    const [ThirdFilePath, setThirdFilePath] = useState('')
    const [images, setImages] = useState([]);
    const [editImages, setEditImages] = useState([]);
    const [otherImages, setOtherImages] = useState([]);
    const [ownerImageError, setOwnerImageError] = useState('');
    const [houseIconError, setHouseIconError] = useState('');

    const [newownerNameEng, setNewOwnerEng] = useState('');
    const [newaddress, setNewAddress] = useState('');
    const [newgender, setNewGender] = useState('');
    const [newaadhaarNo, setNewAadhaarNo] = useState('');
    const [editModalImage, setEditModalImage] = useState();
    const [uploadInProgress, setUploadInProgress] = useState(false);


    console.log('newgender---==============-->', editModalImage);

    const [data, setData] = useState([
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        // Add more options if needed
    ]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${GET_GETVERIFYMAID}/${id}`);
            if (response.data.success) {
                setRegular(response.data.verifyHouseMaid);
                setFilteredData(response.data.verifyHouseMaid);

                // const houseMaidIds = response.data.verifyHouseMaid.map(maid => maid._id);
                // console.log('House Maid IDs: ', houseMaidIds);
            }
            // console.log('Data from API: -----------------------------------> ', response.data);
        } catch (error) {
            //console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (text) => {
        setSearchQuery(text);
        const filtered = regular.filter(item =>
            item.houseMaidEnglish && item.houseMaidEnglish.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const openModal = (house) => {
        setSelectedHouse(house);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedHouse(null);
        setModalVisible(false);
    };
    const closeModalAndResetFields = () => {
        setAddModalVisible(false);
        setOwnerNameEng('');
        setAddress('');
        setGender(null);
        setAadhaarNo('');
        setFilePath('');
        setEditFilePath('');
        setThirdFilePath('');
    };

    const handleImagePicker = (targetState) => {
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
                let imageUri = response.uri || response.assets?.[0]?.uri;
                if (targetState === 'filePath') {
                    setFilePath(imageUri);
                } else if (targetState === 'EditFilePath') {
                    //  console.log('Image picked===============>>:', imageUri);
                    setEditFilePath(imageUri);


                } else if (targetState === 'ThirdFilePath') {
                    setThirdFilePath(imageUri);
                }
            }
        });
    };
    const validateFields = () => {

        let isValid = true;


        if (!ownerNameEng) {
            setErrorEnglishText('Please fill text in English.');
            isValid = false;
        }



        if (!aadhaarNo) {
            setAadhaarError('Aadhaar Card No is required');
            isValid = false;
        } else if (!/^\d{12}$/.test(aadhaarNo)) { // 12 digits for Aadhaar
            setAadhaarError('Aadhaar Card No must be a 12-digit number');
            isValid = false;
        } else {
            setAadhaarError('');
        }

        if (!address) {
            setAddressError('Address is required');
            isValid = false;
        } else {
            setAddressError('');
        }





        if (!gender) {
            setGenderError('Gender is required');
            isValid = false;
        } else {
            setGenderError('');
        }

        if (!filePath) {
            setOwnerImageError('Owner image is required');
            isValid = false;
        } else {
            setOwnerImageError('');
        }


        if (!EditFilePath) {
            setHouseIconError('House icon is required');
            isValid = false;
        } else {
            setHouseIconError('');
        }

        if (ThirdFilePath) {

        }
        return isValid;
    };

    const handleDelete = (index, type) => {
        if (type === 'image') {
            let updatedImages = images.filter((img, i) => i !== index);
            setImages(updatedImages);
        } else if (type === 'filePath') {
            setFilePath('');
        }
    };

    const handleEditModalDelete = (index, type) => {
        if (type === 'image') {
            let updatedEditImages = editImages.filter((img, i) => i !== index);
            setEditImages(updatedEditImages);
        } else if (type === 'EditFilePath') {
            setEditFilePath('');
        }
    };

    const handleOptionalImage = (index, type) => {
        if (type === 'image') {
            let updatedEditImages = otherImages.filter((img, i) => i !== index);
            setOtherImages(updatedEditImages);
        } else if (type === 'ThirdFilePath') {
            setThirdFilePath('');
        }
    }

    const handleAddNewEntries = async () => {
        //  console.log("Id of user is --> ", id);

        if (validateFields()) {
            try {
                const formData = new FormData();

                formData.append('houseMaidEnglish', ownerNameEng);
                formData.append('address', address);
                formData.append('gender', gender);
                formData.append('aadharNumber', aadhaarNo);
                formData.append('paramsId', id)


                if (filePath) {
                    formData.append('image', {
                        uri: filePath,
                        type: 'image/jpeg',
                        name: 'ownerImage.jpg',
                    });
                }

                if (EditFilePath) {
                    formData.append('aadharImage', {
                        uri: EditFilePath,
                        type: 'image/jpeg',
                        name: 'houseIcon.jpg',
                    });
                }

                // if (ThirdFilePath) {
                //     formData.append('optionalImage  ', {
                //         uri: ThirdFilePath,
                //         type: 'image/jpeg',
                //         name: 'optionalImage.jpg',
                //     });
                // }


                const response = await axios.post(POST_GETVERIFYMAID, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                //    console.log('Upload response:', response.data);
                // if (response.data.success) {
                //     //setRegular(prevHouseDetails => [...prevHouseDetails, response.data]);
                // }
                setAddModalVisible(false);

                setOwnerNameEng('');
                setAddress('');
                setGender(null);
                setAadhaarNo('');
                setFilePath('');
                setEditFilePath('');
                //   setThirdFilePath('');
                fetchData()
                return response.data;
            } catch (error) {
                //console.error('Error uploading formData:', error);
                throw error;
            }
        };
    }

    const handleDeleteData = async (delete_id) => {
        console.log(delete_id, '------------------>')
        try {
            const response = await axios.delete(`${DELETE_GETVERIFYMAID}/${delete_id}`);
            if (response.data.success) {
                fetchData();
            }
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    }

    const handleItem = (item) => {
        console.log('1111111111111111111------->', item)
        openEditModall()
        setNewOwnerEng(item.houseMaidEnglish)
        setNewAddress(item.address)
        setNewGender(item.gender)
        setNewAadhaarNo(item.aadharNumber)
        setEditModalImage(item.image);
    }

    const openEditModall = () => {
        setEditModalVisible(true)
    }


    const NoData = () => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '10%' }}>
                <Text style={{ color: 'black', fontSize: 33 }}>No Data Found</Text>
            </View>
        )
    }

    const handleDeleteImage = () => {
        setEditModalImage(null);
        setFilePath(null)
    };


    return (
        <View style={styles.mainContianer}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('DashBoard')}
                    style={styles.backButton}>
                    <Image
                        source={require('../../assets/Image/back.png')}
                        style={styles.backImage}
                    />
                </TouchableOpacity>
                <Text style={styles.headingtxt}>List of {titleEnglish}</Text>
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
                        onPress={() => setAddModalVisible(true)}
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
                    <View style={{ width: '13%', height: 30 }}>
                        <Text style={styles.headerText}>Name</Text>
                    </View>
                    <View style={{ width: '13%' }}>
                        <Text style={styles.headerText}>Gender</Text>
                    </View>
                    <View style={{ width: '13%' }}>
                        <Text style={styles.headerText}>Aadhaar No.</Text>
                    </View>

                    <View style={{ width: '13%' }}>
                        <Text style={styles.headerText}>Attendance</Text>
                    </View>
                    <View style={{ width: '13%' }}>
                        <Text style={styles.headerText}>Details</Text>
                    </View>


                    <View style={{ width: '13%' }}>
                        <Text style={styles.headerText}>Actions</Text>
                    </View>
                </View>
            </View>

            <FlatList
                data={filteredData}
                ListEmptyComponent={NoData}
                renderItem={({ item, index }) => {
                       console.log('---------------------------->', item)
                    return (
                        <View style={styles.itemContainer}>
                            <View style={{ width: 190 }}>
                                <Text style={[styles.itemText, { marginLeft: 5 }]}>
                                    {item.houseMaidEnglish}
                                </Text>
                            </View>


                            <View style={{ width: 100 }}>
                                <Text style={[styles.itemText, {}]}>
                                    {item.gender}
                                </Text>
                            </View>

                            <View style={{ width: 170 }}>
                                <Text style={[styles.itemText, { marginLeft: 25 }]}>
                                    {item.aadharNumber}
                                </Text>
                            </View>

                            <View style={{ width: 150 }}>
                                <TouchableOpacity onPress={() => navigation.navigate('Attendance', { id: item._id })}>
                                    <Text style={[styles.itemText, {}]}>
                                        {'View'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: 150 }}>
                                <TouchableOpacity onPress={() => openModal(item)}>
                                    <Text style={[styles.itemText, {}]}>
                                        {'View'}
                                    </Text>
                                </TouchableOpacity>
                            </View>


                            <View style={[styles.itemCenter, { marginRight: '2%' }]}>
                                <TouchableOpacity onPress={() => handleItem(item)}>
                                    <Image
                                        source={require('../../assets/Image/Edit1.png')}
                                        style={[styles.deleteIcon, { marginLeft: 30 }]} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => handleDeleteData(item._id)} >
                                    <Image
                                        source={require('../../assets/Image/delete1.png')}
                                        style={[styles.deleteIcon, { marginRight: 40 }]}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }}
            />

            {selectedHouse && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={{ marginTop: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.modalTitle}>House Owner Details</Text>
                                <TouchableOpacity onPress={() => closeModal()}>
                                    <Image source={require('../../assets/Image/close.png')} style={{ width: 25, height: 25, marginRight: 25 }} />

                                </TouchableOpacity>

                            </View>
                            <View style={{ marginTop: '5%', width: '100%' }}>


                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: '45%', height: 300, alignItems: 'flex-end' }}>
                                        <Text style={styles.OWNERDETAILSTXT}>Name </Text>
                                        <Text style={styles.OWNERDETAILSTXT}>Gender </Text>
                                        <Text style={styles.OWNERDETAILSTXT}>Address </Text>
                                        <Text style={styles.OWNERDETAILSTXT}>Aadhaar Number </Text>




                                        <Text style={styles.OWNERDETAILSTXT}>User Image </Text>
                                        <Text style={[styles.OWNERDETAILSTXT, { marginTop: 10 }]}>Aadhaar Card Images </Text>
                                        <Text style={[styles.OWNERDETAILSTXT, { marginTop: 10 }]}>Optional Images </Text>

                                    </View>

                                    <View style={{ width: '50%', height: 300, marginLeft: 29 }}>
                                        <Text style={styles.OWNERDETAILSTXT}>{selectedHouse.houseMaidEnglish}</Text>
                                        <Text style={styles.OWNERDETAILSTXT}>{selectedHouse.gender}</Text>
                                        <Text style={styles.OWNERDETAILSTXT}>{selectedHouse.address}</Text>

                                        <Text style={styles.OWNERDETAILSTXT}>{selectedHouse.aadharNumber}</Text>



                                        {selectedHouse.image.length > 0 ? (
                                            <Image
                                                source={{ uri: `${BASE_GUARD}/${selectedHouse.image[0].replace(/^public\//, '')}` }}
                                                style={styles.modalImage}
                                            />
                                        ) : (
                                            <Text style={styles.OWNERDETAILSTXT}>No House Image</Text>
                                        )}
                                        {selectedHouse.aadharImage.length > 0 ? (
                                            <Image
                                                source={{ uri: `${BASE_GUARD}/${selectedHouse.aadharImage[0].replace(/^public\//, '')}` }}
                                                style={styles.modalImage}
                                            />
                                        ) : (
                                            <Text style={styles.OWNERDETAILSTXT}>No Aadhaar Image</Text>
                                        )}
                                        {selectedHouse.optionalImage.length > 0 ? (
                                            <Image
                                                source={{ uri: `${BASE_GUARD}/${selectedHouse.optionalImage[0].replace(/^public\//, '')}` }}
                                                style={styles.modalImage}
                                            />
                                        ) : (
                                            <Text style={styles.OWNERDETAILSTXT}>No Optional Image</Text>
                                        )}
                                    </View>
                                </View>


                            </View>

                        </View>
                    </View>
                </Modal>
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={AddmodalVisible}
                onRequestClose={() => setAddModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <TouchableOpacity
                                onPress={closeModalAndResetFields}
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

                                <View>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Name*
                                    </Text>
                                    <CommonTxtInput
                                        placeholder={'Enter Name Here..'}
                                        value={ownerNameEng}
                                        onChangeText={txt => {
                                            setOwnerNameEng(txt);
                                            if (txt) setErrorEnglishText('');
                                        }}
                                        autoFocus
                                    />
                                    {errorEnglishText ? (
                                        <Text style={styles.errorText}>{errorEnglishText}</Text>
                                    ) : null}
                                </View>


                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Address*
                                    </Text>
                                    <CommonTxtInput
                                        placeholder={'Enter Address Here..'}
                                        value={address}
                                        onChangeText={txt => {
                                            setAddress(txt);
                                            if (txt) setAddressError('');
                                        }}
                                        autoFocus
                                    />
                                    {addressError ? (
                                        <Text style={styles.errorText}>{addressError}</Text>
                                    ) : null}
                                </View>




                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Gender*

                                    </Text>

                                    <Dropdown
                                        style={styles.dropdown}
                                        data={data}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select Gender"
                                        value={gender}
                                        onChange={item => {
                                            setGender(item.value);
                                            setGenderError('');
                                        }}
                                    />
                                    {genderError ? (
                                        <Text style={styles.errorText}>{genderError}</Text>
                                    ) : null}
                                </View>

                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        AadhaarCard No*
                                    </Text>
                                    <CommonTxtInput
                                        placeholder={'Enter Aadhaar Card No Here..'}
                                        value={aadhaarNo}
                                        onChangeText={txt => {
                                            setAadhaarNo(txt);
                                            if (txt) setAadhaarError('');
                                        }}
                                        keyboardType={'number-pad'}
                                    />
                                    {aadhaarError ? (
                                        <Text style={styles.errorText}>{aadhaarError}</Text>
                                    ) : null}
                                </View>

                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}> Add Image*</Text>
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
                                                        onPress={() => handleDelete(null, 'filePath')}
                                                    >
                                                        <Image
                                                            source={require('../../assets/Image/close.png')}
                                                            style={{ width: 25, height: 25 }}
                                                        />
                                                    </TouchableOpacity>

                                                </View>

                                            </View>
                                        )}
                                    </TouchableOpacity>
                                    {ownerImageError ? (
                                        <Text style={styles.errorText}>{ownerImageError}</Text>
                                    ) : null}
                                </View>

                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}> Add Adhaar Image*</Text>
                                    <TouchableOpacity
                                        onPress={() => handleImagePicker('EditFilePath')}
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
                                        {EditFilePath ? (
                                            <Image
                                                source={{ uri: EditFilePath }}
                                                resizeMode='contain'
                                                style={{ width: 100, height: 100 }} />

                                        ) : (
                                            <View style={{ alignItems: 'center' }}>
                                                <Image
                                                    source={require('../../assets/Image/upload.png')}
                                                    style={{ width: 55, height: 55 }}
                                                />
                                                {/* <Text style={{ fontSize: 16, marginTop: 10 }}>Upload an image</Text> */}
                                            </View>
                                        )}
                                        {EditFilePath && (
                                            <View style={styles.modalDelete}>
                                                <TouchableOpacity onPress={() => handleEditModalDelete(null, 'EditFilePath')}>
                                                    <Image
                                                        source={require('../../assets/Image/close.png')}
                                                        style={{ width: 25, height: 25 }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                    {houseIconError ? (
                                        <Text style={styles.errorText}>{houseIconError}</Text>
                                    ) : null}
                                </View>

                                <Text style={{ fontSize: 22, color: 'black', marginTop: 20 }}>Optional*</Text>

                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}> Other Image*(PAN)</Text>
                                    <TouchableOpacity
                                        onPress={() => handleImagePicker('ThirdFilePath')}
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
                                        {ThirdFilePath ? (
                                            <Image
                                                source={{ uri: ThirdFilePath }}
                                                resizeMode='contain'
                                                style={{ width: 100, height: 100 }} />

                                        ) : (
                                            <View style={{ alignItems: 'center' }}>
                                                <Image
                                                    source={require('../../assets/Image/upload.png')}
                                                    style={{ width: 55, height: 55 }}
                                                />
                                                {/* <Text style={{ fontSize: 16, marginTop: 10 }}>Upload an image</Text> */}
                                            </View>
                                        )}
                                        {ThirdFilePath && (
                                            <View style={styles.modalDelete}>
                                                <TouchableOpacity onPress={() => handleOptionalImage(null, 'ThirdFilePath')}>
                                                    <Image
                                                        source={require('../../assets/Image/close.png')}
                                                        style={{ width: 25, height: 25 }}
                                                    />
                                                </TouchableOpacity>
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
                                        marginBottom: 30
                                    }}>
                                    <Text style={{ fontSize: 22, color: '#fff', fontWeight: '600' }}>
                                        Add
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>


            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={EditmodalVisible}
                    onRequestClose={() => setEditModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <ScrollView>
                                <TouchableOpacity
                                    onPress={() => setEditModalVisible(false)}
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
                                    Edit Entries
                                </Text>
                                <View style={{ width: '100%', marginTop: '5%', marginLeft: '5%' }}>

                                    <View>
                                        <Text style={{ fontSize: 22, color: '#000' }}>
                                            Name*
                                        </Text>
                                        <CommonTxtInput
                                            placeholder={'Enter Name Here..'}
                                            value={newownerNameEng}
                                            onChangeText={txt => {
                                                setNewOwnerEng(txt);
                                                if (txt) setErrorEnglishText('');
                                            }}
                                            autoFocus
                                        />
                                        {/* {errorEnglishText ? (
                                        <Text style={styles.errorText}>{errorEnglishText}</Text>
                                    ) : null} */}
                                    </View>


                                    <View style={{ marginTop: '3%' }}>
                                        <Text style={{ fontSize: 22, color: '#000' }}>
                                            Address*
                                        </Text>
                                        <CommonTxtInput
                                            placeholder={'Enter Address Here..'}
                                            value={newaddress}
                                            onChangeText={txt => {
                                                setNewAddress(txt);
                                                if (txt) setAddressError('');
                                            }}
                                            autoFocus
                                        />
                                        {/* {addressError ? (
                                        <Text style={styles.errorText}>{addressError}</Text>
                                    ) : null} */}
                                    </View>




                                    <View style={{ marginTop: '3%' }}>
                                        <Text style={{ fontSize: 22, color: '#000' }}>
                                            Gender*

                                        </Text>

                                        <Dropdown
                                            value={newgender}
                                            style={styles.dropdown}
                                            data={data}
                                            labelField="label"
                                            valueField="value"
                                            placeholder={newgender}
                                            onChange={item => {
                                                setNewGender(item.value);
                                                // setGenderError('');
                                            }}
                                        />
                                        {/* {genderError ? (
                                        <Text style={styles.errorText}>{genderError}</Text>
                                    ) : null} */}
                                    </View>

                                    <View style={{ marginTop: '3%' }}>
                                        <Text style={{ fontSize: 22, color: '#000' }}>
                                            AadhaarCard No*
                                        </Text>
                                        <CommonTxtInput
                                            placeholder={'Enter Aadhaar Card No Here..'}
                                            value={newaadhaarNo}
                                            onChangeText={txt => {
                                                setNewAadhaarNo(txt);
                                                if (txt) setAadhaarError('');
                                            }}
                                            keyboardType={'number-pad'}
                                        />
                                        {/* {aadhaarError ? (
                                        <Text style={styles.errorText}>{aadhaarError}</Text>
                                    ) : null} */}
                                    </View>

                                    <View style={{ marginTop: '3%' }}>
                                        <Text style={{ fontSize: 22, color: '#000' }}> Add Image*</Text>

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
                                            {filePath || console.log("HEy  meee ", filePath) ? (
                                                <View style={{ alignItems: 'center', backgroundColor: 'red' }}>
                                                    <Image
                                                        source={{ uri: filePath }}
                                                        resizeMode='contain'
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
                                            ) : (editModalImage  || console.log("sahill  -->", editImages)) ? (
                                                <View style={{ position: 'relative', justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
                                                    <Image
                                                        source={{ uri: `${BASE_GUARD}/${editImages.replace(/^public\//, '')}` }}
                                                        resizeMode="contain"
                                                        style={{ width: 50, height: 50 }}
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
                                            ) : (
                                                <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => handleImagePicker('filePath')}>
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
                                        {/* {console.log("filePath:", filePath)}
                                        {console.log("editModalImage:", editModalImage)} */}
                                    </View>

                                    <View style={{ marginTop: '3%' }}>
                                        <Text style={{ fontSize: 22, color: '#000' }}> Add Adhaar Image*</Text>
                                        <TouchableOpacity
                                            // onPress={() => handleImagePicker('EditFilePath')}
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
                                            {/* {EditFilePath ? (
                                            <Image
                                                source={{ uri: EditFilePath }}
                                                resizeMode='contain'
                                                style={{ width: 100, height: 100 }} />

                                        ) : (
                                            <View style={{ alignItems: 'center' }}>
                                                <Image
                                                    source={require('../../assets/Image/upload.png')}
                                                    style={{ width: 55, height: 55 }}
                                                />
                                                 <Text style={{ fontSize: 16, marginTop: 10 }}>Upload an image</Text> 
                                            </View>
                                        )} */}
                                            {/* {EditFilePath && (
                                            <View style={styles.modalDelete}>
                                                <TouchableOpacity onPress={() => handleEditModalDelete(null, 'EditFilePath')}>
                                                    <Image
                                                        source={require('../../assets/Image/close.png')}
                                                        style={{ width: 25, height: 25 }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        )} */}
                                        </TouchableOpacity>
                                        {/* {houseIconError ? (
                                        <Text style={styles.errorText}>{houseIconError}</Text>
                                    ) : null} */}
                                    </View>
                                    <Text style={{ fontSize: 22, color: 'black', marginTop: 20 }}>Optional*</Text>


                                    <View style={{ marginTop: '3%' }}>
                                        <Text style={{ fontSize: 22, color: '#000' }}> Other Image*(PAN)</Text>
                                        <TouchableOpacity
                                            //  onPress={() => handleImagePicker('ThirdFilePath')}
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
                                            {/* {ThirdFilePath ? (
                                            <Image
                                                source={{ uri: ThirdFilePath }}
                                                resizeMode='contain'
                                                style={{ width: 100, height: 100 }} />

                                        ) : (
                                            <View style={{ alignItems: 'center' }}>
                                                <Image
                                                    source={require('../../assets/Image/upload.png')}
                                                    style={{ width: 55, height: 55 }}
                                                />
                                                 <Text style={{ fontSize: 16, marginTop: 10 }}>Upload an image</Text> 
                                            </View>
                                        )}
                                        {ThirdFilePath && (
                                            <View style={styles.modalDelete}>
                                                <TouchableOpacity onPress={() => handleOptionalImage(null, 'ThirdFilePath')}>
                                                    <Image
                                                        source={require('../../assets/Image/close.png')}
                                                        style={{ width: 25, height: 25 }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        )} */}
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity
                                        //onPress={handleAddNewEntries}
                                        style={{
                                            width: '49%',
                                            height: 60,
                                            marginTop: 30,
                                            backgroundColor: '#f64f6d',
                                            borderRadius: 10,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginBottom: 30
                                        }}>
                                        <Text style={{ fontSize: 22, color: '#fff', fontWeight: '600' }}>
                                            Add
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </View>

        </View>
    )
}

export default AllEntries

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
        height: '70%',
        // padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        //alignItems: 'center',
    },
    modalTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: '27%'
    },
    OWNERDETAILSTXT: {
        fontSize: 22, color: '#000', fontWeight: '600'
    },
    modalImage: {
        width: 30,
        height: 30,
        marginVertical: 10,
    },
    modalContainer1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent1: {
        width: '60%',
        // padding: '4%',
        height: 800,
        backgroundColor: '#fff',
        borderRadius: 10,
        //alignItems: 'center',
    },
    modalTitle1: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000',
    },
    modalImage1: {
        width: 150,
        height: 100,
    },
    dropdown: {
        width: '50%',
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: 10
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    modalDelete: {
        position: 'absolute',
        top: 10,
        right: 10
        //left: 25
        // marginLeft: 15,
    },
    errorText: { color: 'red', marginTop: 5 },
    closeIcon: {
        width: 20, height: 20
    }
})