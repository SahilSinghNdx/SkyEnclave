import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, TextInput, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_GUARD } from '../../Config';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios, { Axios } from 'axios';


const ProfileUser = ({ navigation }) => {
    const [userData, setUserData] = useState({});
    const [modalEditVisible, setModalEditVisible] = useState(false)
    const [username, setUserName] = useState('')
    const [useremail, setUserEmail] = useState('')
    const [userPhone, setUserPhone] = useState('')
    const [filePath, setFilePath] = useState();
    const [pickImage, setPickImage] = useState('')
    const [modalId, setModalId] = useState('')


    const fetchData = async () => {
        try {
            const data = await AsyncStorage.getItem('userData');
            if (data !== null) {
                setUserData(JSON.parse(data));
                console.log('--------------->', data);
            }
        } catch (error) {
            console.error('Error retrieving user data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const imageUrl = userData.Ownerimage ? `${BASE_GUARD}/${userData.Ownerimage.replace(/^public\//, '')}` : null;

    const openModal = (item) => {
        console.log("MOdal Open ---->")
      
            setModalEditVisible(true);
            setUserName(item.name);
            setUserEmail(item.username);
            setUserPhone(item.contactName);
            setModalId(item._id);

    }

    const closeEditModal = () => {
        console.log("Profile modal close")
        setModalEditVisible(false)
    }

    const handleImagePicker = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
        };

        launchCamera(options, response => {
            if (response.didCancel) {
                // User cancelled image pickers

            } else if (response.error) {
                // Handle error
            } else {
                const imageUri = response.assets?.[0]?.uri || response.uri;
                setPickImage(imageUri);
            }
        });
    };

    const handleEditData = async () => {
       
       // console.log("hello user this is new data --> ", username, useremail, userPhone,pickImage);
       // console.log(modalId,'uydsdfgsdysgy-----------')
        const formData = new FormData();
        formData.append('name', username);
        formData.append('username', useremail);
        formData.append('userPhoneNo', userPhone);

        // Append the image if it exists
        if (pickImage) {
            formData.append('Ownerimage', {
                uri: pickImage,
                type: 'image/jpeg', // Adjust if your image type is different
                name: 'icon.jpg', // Name of the file
            });
        }
        try {
            const response = await axios.put(`https://app.guardx.cloud/api/editAdminimage/${modalId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Upload response: is here --> ', response.data.message);
            fetchData()
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

    return (
        <View style={styles.mainContianer}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}>
                    <Image
                        source={require('../../../assets/Image/back.png')}
                        style={[styles.backImage, {}]}
                    />
                </TouchableOpacity>
                <Text style={[styles.headingtxt, { marginLeft: '8%' }]}>Profile</Text>
                <TouchableOpacity onPress={() => openModal(userData)} style={{ width: 140, height: 50, marginRight: 30, borderWidth: .7, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                    <Text style={styles.headingtxt}>Edit</Text>
                    <Image
                        source={require('../../../assets/Image/edit.png')}
                        style={{ width: 30, height: 30 }}
                    />

                </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', marginTop: '5%' }}>
                {imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        style={{ width: 150, height: 150 }}
                    />
                ) : (
                    <Text>No image available</Text>
                )}
                <View style={{}}>
                    {/* <TouchableOpacity style={{ width: 20, height: 20, backgroundColor: '#fff', elevation: 5, position: 'absolute', bottom: 13, left: 38,borderRadius:20 }}>
                  <Image
                      source={require('../../../assets/Image/edit.png')}
                      style={{ width: 20, height: 20 }}
                      />
                  </TouchableOpacity> */}
                </View>
                <View style={{ marginTop: '7%', width: '100%', marginLeft: '8%' }}>


                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: '45%', height: 300, alignItems: 'flex-end' }}>
                            <Text style={styles.txt}>Name :</Text>
                            <Text style={styles.txt}>Email :</Text>
                            <Text style={styles.txt}>Phone No :</Text>
                            <Text style={styles.txt}>Role :</Text>

                        </View>

                        <View style={{ width: '50%', height: 300, marginLeft: 29 }}>
                            <Text style={styles.txt}>{userData.name || 'N/A'}</Text>
                            <Text style={styles.txt}>{userData.username || 'N/A'}</Text>
                            <Text style={styles.txt}>{userData.contactName || 'N/A'}</Text>
                            <Text style={styles.txt}>{userData.role || 'N/A'}</Text>
                        </View>
                    </View>


                </View>

            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalEditVisible}
                onRequestClose={closeEditModal}

            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                                <Text style={[styles.headingtxt, { marginLeft: '46%' }]}>Edit</Text>
                                <TouchableOpacity onPress={closeEditModal}>
                                    <Image
                                        source={require('../../../assets/Image/close.png')}
                                        style={{ width: 30, height: 30, marginRight: 20 }}
                                    />
                                </TouchableOpacity>




                            </View>
                            <View style={{ alignItems: 'center', marginTop: '5%' }}>
                                {pickImage ? (<Image
                                    source={{ uri: pickImage }}
                                    style={{ width: 150, height: 150, borderRadius: 60 }}
                                />) : imageUrl ? (
                                    <Image
                                        source={{ uri: imageUrl }}
                                        style={{ width: 150, height: 150, borderRadius: 60 }}
                                    />
                                ) : (
                                    <Text>No image available</Text>
                                )}
                                <View style={{}}>
                                    <TouchableOpacity onPress={() => handleImagePicker()} style={{ width: 20, height: 20, backgroundColor: '#fff', elevation: 5, position: 'absolute', bottom: 13, left: 48, borderRadius: 20 }}>
                                        <Image
                                            source={require('../../../assets/Image/edit.png')}
                                            style={{ width: 20, height: 20 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ width: '100%', alignItems: 'center' }}>


                                <View style={{ marginTop: '5%' }}>
                                    <Text style={styles.txt}>UserName*</Text>
                                    <View style={{ marginTop: 10, flexDirection: 'row', width: '30%', height: 50, backgroundColor: '#e5e5e5', alignItems: 'center', borderRadius: 10 }}>

                                        <TextInput value={username} style={{ width: '100%', height: 50, color: '#000', fontSize: 22, paddingLeft: 15 }} onChangeText={(txt) => setUserName(txt)} />
                                    </View>
                                </View>
                                <View style={{ marginTop: '2%' }}>
                                    <Text style={styles.txt}>UserEmail*</Text>
                                    <View style={{ marginTop: 10, flexDirection: 'row', width: '30%', height: 50, backgroundColor: '#e5e5e5', alignItems: 'center', borderRadius: 10 }}>

                                        <TextInput value={useremail} style={{ width: '100%', height: 50, color: '#000', fontSize: 22, paddingLeft: 15 }} onChangeText={(txt) => setUserEmail(txt)} />
                                    </View>
                                </View>
                                <View style={{ marginTop: '2%' }}>
                                    <Text style={styles.txt}>userPhoneNo*</Text>
                                    <View style={{ marginTop: 10, flexDirection: 'row', width: '30%', height: 50, backgroundColor: '#e5e5e5', alignItems: 'center', borderRadius: 10 }}>

                                        <TextInput value={userPhone} style={{ width: '100%', height: 50, color: '#000', fontSize: 22, paddingLeft: 15 }} onChangeText={(txt) => setUserPhone(txt)} />
                                    </View>
                                </View>

                                <TouchableOpacity onPress={() => { handleEditData(),setModalEditVisible(false) }} style={{ width: '31%', height: 60, backgroundColor: '#f64f6d', alignSelf: 'center', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: '5%', marginBottom: 20 }}>
                                    <Text style={{ fontSize: 33, color: '#fff', fontWeight: '500' }}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default ProfileUser

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
        width: '100%',
        //backgroundColor: 'red'
    },
    backButton: {
        marginLeft: '2%',
    },
    backImage: {
        width: 60,
        height: 40,
    },
    txt: {
        fontSize: 32, color: '#000', fontWeight: '500'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        height: '80%',
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
})