import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, FlatList, Modal, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { BASE_GUARD, GET_HOUSEDETAILS, POST_HOUSEDETAILS,DELETE_HOUSEDETAILS } from '../Config';
import CommonTxtInput from '../Component/CommonTxtInput';
import { Dropdown } from 'react-native-element-dropdown';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logo = require('../../assets/Image/image1.png');

const HouseList = ({ navigation }) => {
    const [getHouseDetails, setHouseDetails] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedHouse, setSelectedHouse] = useState(null);
    const [modalAddVisible, setModalAddVisible] = useState(false);
    const [value, setValue] = useState(null);
    const [filePath, setFilePath] = useState('');
    const [EditFilePath, SetEditfilePath] = useState();
    const [images, setImages] = useState([]);
    const [editImages, setEditImages] = useState([]);

    const [houseNo, setHouseNo] = useState('');
    const [houseNoError, setHouseNoError] = useState('');

    const [ownerNameEng, setOwnerNameEng] = useState('');
    const [errorEnglishText, setErrorEnglishText] = useState('');

    const [contactNo, setContactNo] = useState('');
    const [contactNoError, setContactNoError] = useState('');

    const [altContactNo, setAltContactNo] = useState('');
    const [altContactNoError, setAltContactNoError] = useState('');

    const [blockNo, setBlockNo] = useState('');
    const [blockNoError, setBlockNoError] = useState('');

    const [address, setAddress] = useState('');
    const [addressError, setAddressError] = useState('');

    const [gender, setGender] = useState(null);
    const [genderError, setGenderError] = useState('');

    const [vehicleInfo, setVehicleInfo] = useState('');
    const [vehicleInfoError, setVehicleInfoError] = useState('');

    const [aadhaarNo, setAadhaarNo] = useState('');
    const [aadhaarError, setAadhaarError] = useState('');


    const[filterData,setFilterData]=useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [selectItem, setSelectedItem] = useState(null);

    const [modalEditVisible, setModalEditVisible] = useState(false);

    const [newhouseNo, setNewHouseNo] = useState('');
    const [newownerNameEng, setNewOwnerNameEng] = useState('');
    const [newcontactNo, setNewContactNo] = useState('');
    const [newaltContactNo, setNewAltContactNo] = useState('');
    const [newblockNo, setNewBlockNo] = useState('');
    const [newaddress, setNewAddress] = useState('');
    const [newgender, setNewGender] = useState(null);
    const [newvehicleInfo, setNewVehicleInfo] = useState('');
    const [newaadhaarNo, setNewAadhaarNo] = useState('');

    const [modalId, setModalId] = useState('')


    console.log('filePath:', filePath);
    console.log('EditFilePath:', EditFilePath);

    const fetchData = async () => {
        try {
            const userID = await AsyncStorage.getItem('userID');
            axios.get(GET_HOUSEDETAILS)
                .then(response => {
                    const data = response.data.data;
                    // Filter the data based on society_id matching the userID
                    const filteredData = data.filter(item => item.society_id === userID);
                    setHouseDetails(filteredData);
                    setFilterData(filteredData)
                   // console.log('Filtered Data: ', filteredData);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        } catch (error) {
            console.error('Error retrieving userID:', error);
        }
    };

    useEffect(() => {
      fetchData()
    }, []);

    const openModal = (house) => {
        setSelectedHouse(house);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedHouse(null);
        setModalVisible(false);
    };

    const data = [
        { label: 'Male', value: '1' },
        { label: 'Female', value: '2' },
    ];

    const handleImagePicker = (targetState) => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
        };
        launchCamera(options, response => {
            if (response.didCancel) {
                // User cancelled image picker
            } else if (response.error) {
                // Handle error
            } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                if (targetState === 'filePath') {
                    setFilePath(imageUri);
                } else if (targetState === 'EditFilePath') {  
                    SetEditfilePath(imageUri);
                }
            }
        });
    };

    const handleItemClick = (item) => {
        console.log('111111111111111>>>>', item)
        setNewHouseNo(item.houseNo)
        setNewOwnerNameEng(item.ownerName)
        setNewContactNo(item.contact)
        setNewAltContactNo(item.alternateContact)
        setNewBlockNo(item.blockNumber)
        setNewAadhaarNo(item.aadhaarNumber)
        setNewGender(item.gender)
        setNewVehicleInfo(item.vehicleInfo)
        setNewAddress(item.address)
        setModalId(item._id)
        openEditModall();
    }


    const openEditModall = () => {
        setModalEditVisible(true)
    }

console.log('selected Item',selectItem)

    const handleSearch = (text) => {
        setSearchQuery(text);
        const filtered = getHouseDetails.filter(item =>
            item.houseNo && item.ownerName.toLowerCase().includes(text.toLowerCase())
        );
        setFilterData(filtered);
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
            SetEditfilePath('');
        }
    };

  

    const validateFields = () => {

        let isValid = true;
        if (!houseNo) {
            setHouseNoError('House No is required');
            isValid = false;
        } else {
            setHouseNoError('');
        }

       
        if (!ownerNameEng) {
            setErrorEnglishText('Please fill text in English.');
            isValid = false;
        }
        if (!contactNo) {
            setContactNoError('Contact No is required');
            isValid = false;
        } else if (!/^\d+$/.test(contactNo)) {
            setContactNoError('Contact No must be numeric');
            isValid = false;
        } else {
            setContactNoError('');
        }

        if (!altContactNo) {
            setAltContactNoError('Alternate Contact No is required');
            isValid = false;
        } else if (!/^\d+$/.test(altContactNo)) {
            setAltContactNoError('Alternate Contact No must be numeric');
            isValid = false;
        } else {
            setAltContactNoError('');
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
        }  else {
            setAddressError('');
        }

        if (!vehicleInfo) {
            setVehicleInfoError('Vehicle Info is required');
            isValid = false;
        } else {
            setVehicleInfoError('');
        }

        if (!blockNo) {
            setBlockNoError('Block No is required');
            isValid = false;
        } else {
            setBlockNoError('');
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

        // House Icon Validation
        if (!EditFilePath) {
            setHouseIconError('House icon is required');
            isValid = false;
        } else {
            setHouseIconError('');
        }


        return isValid;
    };

    const handleAddNewEntries = async () => {
        if (validateFields()) {
            const formData = new FormData();
            formData.append('houseNo', houseNo);
            formData.append('ownerName', ownerNameEng);
            formData.append('contact', contactNo);
            formData.append('alternateContact', altContactNo);
            formData.append('blockNumber', blockNo);
            formData.append('address', address);
            formData.append('gender', gender);
            formData.append('vehicleInfo', vehicleInfo);
            formData.append('aadhaarNumber', aadhaarNo);

            if (filePath) {
                formData.append('ownerImages', {
                    uri: filePath,
                    type: 'image/jpeg',
                    name: 'ownerImage.jpg',
                });
            }

            if (EditFilePath) {
                formData.append('houseIcon', {
                    uri: EditFilePath,
                    type: 'image/jpeg',
                    name: 'houseIcon.jpg',
                });
            }

            try {
                const societyID = await AsyncStorage.getItem('userID');
                const createdByID = await AsyncStorage.getItem('userID');

                if (societyID) {
                    formData.append('society_id', societyID);
                } else {
                    console.error('No society ID found in AsyncStorage');
                }
                if (createdByID) {
                    formData.append('createdBy', createdByID);
                } else {
                    console.error('No createdBy ID found in AsyncStorage');
                }

                console.log('Form data before sending:', formData);

                try {
                    const response = await axios.post(POST_HOUSEDETAILS, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    console.log('Upload response:', response.data);

                    setModalAddVisible(false);
                    setHouseNo('');
                    setOwnerNameEng('');
                    setContactNo('');
                    setAltContactNo('');
                    setBlockNo('');
                    setAddress('');
                    setGender(null);
                    setVehicleInfo('');
                    setAadhaarNo('');
                    setFilePath('');
                    SetEditfilePath('');

                    fetchData();

                    return response.data;
                } catch (error) {
                    console.error('Error uploading formData:', error);
                }
            } catch (error) {
                console.error('Error retrieving IDs from AsyncStorage:', error);
            }
        }
    };

    
    const handleDeleteEntry = async (delete_id) => {
        // console.log(delete_id, '------------------>')
        try {
            const response = await axios.delete(`${DELETE_HOUSEDETAILS}/${delete_id}`);
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

    const updateEntry = async () => {
        console.log("hello user this is new data --> ", newhouseNo, newownerNameEng, newgender);
        const formData = {
            "houseNo": newhouseNo,
            "ownerName": newownerNameEng,
            "gender": newgender,
            "contact": newcontactNo,
            "alternateContact": newaltContactNo,
            "address": newaddress,
            "vehicleInfo":newvehicleInfo,
            "blockNumber":newblockNo,
            "aadhaarNumber":newaadhaarNo,
          
        }

        console.log('------------------------------------------->', formData)
        try {
            const response = await axios.put(`https://app.guardx.cloud/api/houseDetailsUpdate/${modalId}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Upload response: is here --> ', response.data);
            fetchData()
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };
    

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
                <Text style={styles.headingtxt}>House Details</Text>
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
                        onPress={() => setModalAddVisible(true)}
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
                        <Text style={styles.headerText}>House No.</Text>
                    </View>
                    <View style={{ width: '13%' }}>
                        <Text style={styles.headerText}>House Icon</Text>
                    </View>
                    <View style={{ width: '13%' }}>
                        <Text style={styles.headerText}>Owner</Text>
                    </View>

                    <View style={{ width: '13%' }}>
                        <Text style={styles.headerText}>Contact</Text>
                    </View>
                    <View style={{ width: '13%' }}>
                        <Text style={styles.headerText}>Address</Text>
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
                data={filterData}

                renderItem={({ item, index }) => {
                    return (
                        <View key={item._id} style={styles.itemContainer}>
                            <View style={{ width: 150 }}>
                                <Text style={[styles.itemText, {}]}>
                                    {item.houseNo}
                                </Text>
                            </View>

                            <View style={{ width: 160, alignItems: 'center' }}>
                                {item.houseIcon ? (
                                    <Image
                                        source={{ uri: `${BASE_GUARD}/${item.houseIcon.replace(/^public\//, '')}` }}
                                        style={styles.itemImage}
                                    />
                                ) : (
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={styles.itemText}>Image not added</Text>
                                    </View>
                                )}
                            </View>

                            <View style={{ width: 140 }}>
                                <Text style={[styles.itemText, {}]}>
                                    {item.ownerName}
                                </Text>
                            </View>

                            <View style={{ width: 140 }}>
                                <Text style={[styles.itemText, {}]}>
                                    {item.contact}
                                </Text>
                            </View>

                            <View style={{ width: 150, }}>
                                <Text style={[styles.itemText, {}]}>
                                    {item.address}
                                </Text>
                            </View>

                            <View style={{ width: 150 }}>
                                <TouchableOpacity onPress={() => openModal(item)}>
                                    <Text style={[styles.itemText, {}]}>
                                        {'View Details'}
                                    </Text>
                                </TouchableOpacity>

                            </View>
                            <View style={[styles.itemCenter, { marginRight: '2%' }]}>
                                <TouchableOpacity onPress={()=>handleItemClick(item)}>
                                    <Image
                                        source={require('../../assets/Image/Edit1.png')}
                                        style={[styles.deleteIcon, { marginLeft: 30 }]} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=>handleDeleteEntry(item._id)}>
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
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
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
                                        <Text style={styles.OWNERDETAILSTXT}>House No </Text>
                                        <Text style={styles.OWNERDETAILSTXT}>Owner Name(Hindi) </Text>
                                        <Text style={styles.OWNERDETAILSTXT}>Owner Name (English) </Text>

                                        <Text style={styles.OWNERDETAILSTXT}>Gender </Text>
                                        <Text style={styles.OWNERDETAILSTXT}>Contact </Text>

                                        <Text style={styles.OWNERDETAILSTXT}>Alternate Contact </Text>
                                        <Text style={styles.OWNERDETAILSTXT}>Vehicle Info </Text>
                                        <Text style={styles.OWNERDETAILSTXT}>Block Number </Text>
                                        <Text style={styles.OWNERDETAILSTXT}>Aadhaar Number </Text>

                                        <Text style={styles.OWNERDETAILSTXT}>Address </Text>
                                        <Text style={styles.OWNERDETAILSTXT}>Image </Text>
                                        <Text style={[styles.OWNERDETAILSTXT, { marginTop: 20 }]}>House Icon </Text>

                                    </View>

                                    <View style={{ width: '50%', height: 300, marginLeft: 29 }}>
                                        <Text style={styles.OWNERDETAILSTXT}>{selectedHouse.houseNo}</Text>
                                        <Text style={styles.OWNERDETAILSTXT}>{selectedHouse.ownerNameHindi}</Text>
                                        <Text style={styles.OWNERDETAILSTXT}>{selectedHouse.ownerName}</Text>

                                        <Text style={styles.OWNERDETAILSTXT}>{selectedHouse.gender}</Text>
                                        <Text style={styles.OWNERDETAILSTXT}>{selectedHouse.contact}</Text>

                                        <Text style={styles.OWNERDETAILSTXT}>{selectedHouse.alternateContact}</Text>
                                        <Text style={styles.OWNERDETAILSTXT}>{selectedHouse.vehicleInfo}</Text>
                                        <Text style={styles.OWNERDETAILSTXT}>{selectedHouse.blockNumber}</Text>
                                        <Text style={styles.OWNERDETAILSTXT}>{selectedHouse.aadhaarNumber}</Text>

                                        <Text style={styles.OWNERDETAILSTXT}>{selectedHouse.address}</Text>
                                        {selectedHouse.ownerImages ? (
                                            <Image
                                                source={{ uri: `${BASE_GUARD}/${selectedHouse.ownerImages[0].replace(/^public\//, '')}` }}
                                                style={styles.modalImage}
                                            />
                                        ) : (
                                            <Text style={styles.OWNERDETAILSTXT}>No House Image</Text>
                                        )}
                                        {selectedHouse.houseIcon ? (
                                            <Image
                                                source={{ uri: `${BASE_GUARD}/${selectedHouse.houseIcon.replace(/^public\//, '')}` }}
                                                style={styles.modalImage}
                                            />
                                        ) : (
                                            <Text style={styles.OWNERDETAILSTXT}>No House Image</Text>
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
                visible={modalAddVisible}
                onRequestClose={() => {
                    setModalAddVisible(!modalAddVisible);
                }}>
                <View style={styles.modalContainer1}>
                    <View style={styles.modalContent1}>
                        <ScrollView>
                            <TouchableOpacity
                                onPress={() => setModalAddVisible(!modalAddVisible)}
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
                                        House No.*
                                    </Text>
                                    <CommonTxtInput
                                        placeholder={'Enter House No Here..'}
                                        value={houseNo}
                                        onChangeText={setHouseNo}
                                        //  style={[styles.input]}
                                        autoFocus
                                    />
                                    {houseNoError ? <Text style={{ color: 'red' }}>{houseNoError}</Text> : null}

                                </View>

                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Owner Name in English*
                                    </Text>
                                    <CommonTxtInput
                                        value={ownerNameEng}
                                        onChangeText={txt => {
                                            setOwnerNameEng(txt);
                                            if (txt) setErrorEnglishText('');
                                        }}
                                        placeholder={'Enter Owner Name Here..'}

                                    />
                                    {errorEnglishText ? (
                                        <Text style={{ color: 'red' }}>{errorEnglishText}</Text>
                                    ) : null}
                                </View>

                                   
                                    <View style={{ marginTop: '3%' }}>
                                        <Text style={{ fontSize: 22, color: '#000' }}>
                                            Contact No.*
                                        </Text>
                                        <CommonTxtInput
                                            placeholder={'Enter Contact Here..'}
                                            value={contactNo}
                                            onChangeText={setContactNo}
                                            keyboardType={'number-pad'}
                                        />
                                        {contactNoError ? <Text style={{ color: 'red' }}>{contactNoError}</Text> : null}

                                    </View>
                                    <View style={{ marginTop: '3%' }}>
                                        <Text style={{ fontSize: 22, color: '#000' }}>
                                            Alternate Contact No.*
                                        </Text>
                                        <CommonTxtInput
                                            placeholder={'Enter Alternate Contact Here..'}
                                            value={altContactNo}
                                            onChangeText={setAltContactNo}
                                            keyboardType={'number-pad'}
                                        />
                                        {altContactNoError ? <Text style={{ color: 'red' }}>{altContactNoError}</Text> : null}

                                    </View>
                                    <View style={{ marginTop: '3%' }}>
                                        <Text style={{ fontSize: 22, color: '#000' }}>
                                            Block No.*
                                        </Text>
                                        <CommonTxtInput
                                            placeholder={'Enter Block No Here..'}
                                            value={blockNo}
                                            onChangeText={setBlockNo}
                                        />
                                        {blockNoError ? <Text style={{ color: 'red' }}>{blockNoError}</Text> : null}

                                    </View>
                                    <View style={{ marginTop: '3%' }}>
                                        <Text style={{ fontSize: 22, color: '#000' }}>
                                            Address*
                                        </Text>
                                        <CommonTxtInput
                                            placeholder={'Enter Address Here..'}
                                            value={address}
                                            onChangeText={setAddress}
                                        />
                                        {addressError ? <Text style={{ color: 'red' }}>{addressError}</Text> : null}

                                    </View>
                                    <View style={{ marginTop: '3%' }}>
                                        <Text style={{ fontSize: 22, color: '#000' }}>
                                            Gender*

                                        </Text>

                                        <Dropdown
                                            style={[styles.dropdown, { borderColor: '#000', marginTop: 10 }]}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={data}
                                            search
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder={'Select Gender'}
                                            searchPlaceholder="Search..."
                                            value={gender}
                                            onChange={item => {
                                                setGender(item.value);
                                                setGenderError('');  // Clear error on selection
                                            }}
                                        />
                                        {genderError ? <Text style={{ color: 'red' }}>{genderError}</Text> : null}

                                    </View>
                                    <View style={{ marginTop: '3%' }}>
                                        <Text style={{ fontSize: 22, color: '#000' }}>
                                            Vehicle Info*
                                        </Text>
                                        <CommonTxtInput
                                            placeholder={'Enter Vehicle Info Here..'}
                                            value={vehicleInfo}
                                            onChangeText={setVehicleInfo}
                                        />
                                        {vehicleInfoError ? <Text style={{ color: 'red' }}>{vehicleInfoError}</Text> : null}

                                    </View>
                                    <View style={{ marginTop: '3%' }}>
                                        <Text style={{ fontSize: 22, color: '#000' }}>
                                            AadhaarCard No*
                                        </Text>
                                        <CommonTxtInput
                                            placeholder={'Enter Aadhaar Card No Here..'}
                                            value={aadhaarNo}
                                            onChangeText={setAadhaarNo}
                                            keyboardType={'number-pad'}
                                        />
                                        {aadhaarError ? <Text style={{ color: 'red' }}>{aadhaarError}</Text> : null}

                                    </View>
                                
                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}> Add Owner Image*</Text>
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
                                </View>
                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}> Add House Icon*</Text>
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
                                        Submit
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>

                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalEditVisible}
                onRequestClose={() => {
                    setModalEditVisible(false);
                }}>
                <View style={styles.modalContainer1}>
                    <View style={styles.modalContent1}>
                        <ScrollView>
                            <TouchableOpacity
                                onPress={() => setModalEditVisible(false)}
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
                                        House No.*
                                    </Text>
                                    <CommonTxtInput
                                        placeholder={'Enter House No Here..'}
                                        value={newhouseNo}
                                        onChangeText={setNewHouseNo}
                                        //  style={[styles.input]}
                                        autoFocus
                                    />
                                    {houseNoError ? <Text style={{ color: 'red' }}>{houseNoError}</Text> : null}

                                </View>

                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Owner Name in English*
                                    </Text>
                                    <CommonTxtInput
                                        value={newownerNameEng}
                                        onChangeText={txt => {
                                            setNewOwnerNameEng(txt);
                                            if (txt) setErrorEnglishText('');
                                        }}
                                        placeholder={'Enter Owner Name Here..'}

                                    />
                                    {errorEnglishText ? (
                                        <Text style={{ color: 'red' }}>{errorEnglishText}</Text>
                                    ) : null}
                                </View>


                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Contact No.*
                                    </Text>
                                    <CommonTxtInput
                                        placeholder={'Enter Contact Here..'}
                                        value={newcontactNo}
                                        onChangeText={setNewContactNo}
                                        keyboardType={'number-pad'}
                                    />
                                    {contactNoError ? <Text style={{ color: 'red' }}>{contactNoError}</Text> : null}

                                </View>
                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Alternate Contact No.*
                                    </Text>
                                    <CommonTxtInput
                                        placeholder={'Enter Alternate Contact Here..'}
                                        value={newaltContactNo}
                                        onChangeText={setNewAltContactNo}
                                        keyboardType={'number-pad'}
                                    />
                                    {altContactNoError ? <Text style={{ color: 'red' }}>{altContactNoError}</Text> : null}

                                </View>
                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Block No.*
                                    </Text>
                                    <CommonTxtInput
                                        placeholder={'Enter Block No Here..'}
                                        value={newblockNo}
                                        onChangeText={setNewBlockNo}
                                    />
                                    {blockNoError ? <Text style={{ color: 'red' }}>{blockNoError}</Text> : null}

                                </View>
                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Address*
                                    </Text>
                                    <CommonTxtInput
                                        placeholder={'Enter Address Here..'}
                                        value={newaddress}
                                        onChangeText={setNewAddress}
                                    />
                                    {addressError ? <Text style={{ color: 'red' }}>{addressError}</Text> : null}

                                </View>
                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Gender*

                                    </Text>

                                    <Dropdown
                                        style={[styles.dropdown, { borderColor: '#000', marginTop: 10 }]}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        iconStyle={styles.iconStyle}
                                        data={data}
                                        search
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={newgender ? newgender :'Select Gender'}
                                        searchPlaceholder="Search..."
                                        value={newgender}
                                        onChange={item => {
                                            setNewGender(item.value);
                                            setGenderError('');  // Clear error on selection
                                        }}
                                    />
                                    {genderError ? <Text style={{ color: 'red' }}>{genderError}</Text> : null}

                                </View>
                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Vehicle Info*
                                    </Text>
                                    <CommonTxtInput
                                        placeholder={'Enter Vehicle Info Here..'}
                                        value={newvehicleInfo}
                                        onChangeText={setNewVehicleInfo}
                                    />
                                    {vehicleInfoError ? <Text style={{ color: 'red' }}>{vehicleInfoError}</Text> : null}

                                </View>
                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        AadhaarCard No*
                                    </Text>
                                    <CommonTxtInput
                                        placeholder={'Enter Aadhaar Card No Here..'}
                                        value={newaadhaarNo}
                                        onChangeText={setNewAadhaarNo}
                                        keyboardType={'number-pad'}
                                    />
                                    {aadhaarError ? <Text style={{ color: 'red' }}>{aadhaarError}</Text> : null}

                                </View>

                                
                              

                                <TouchableOpacity
                                    onPress={() => { updateEntry(), setModalEditVisible(false) }}
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
                                        Submit
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>

                </View>
            </Modal>
        </View>
    )
}

export default HouseList

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
})