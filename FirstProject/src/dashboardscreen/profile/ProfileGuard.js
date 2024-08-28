import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, TextInput, ScrollView, Alert, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_GUARD } from '../../Config';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios, { Axios } from 'axios';
const { width, height } = Dimensions.get('window');
import { useTranslation } from 'react-i18next';


const ProfileGuard = ({ navigation,route }) => {

    const { t } = useTranslation();

  

    const [userData, setUserData] = useState({});
    const [modalEditVisible, setModalEditVisible] = useState(false)
    const [username, setUserName] = useState('')
    const [useremail, setUserEmail] = useState('')
    const [userPhone, setUserPhone] = useState()
    const [filePath, setFilePath] = useState();
    const [pickImage, setPickImage] = useState('')
    const [modalId, setModalId] = useState('')
console.log('-------->>>----->>>',modalId)

    const isTablet = width > 600;

    const Styles = {
        imageStyle: {
            width: isTablet ? 300 : 150, // Larger size for tablets
            height: isTablet ? 250 : 150,
            borderRadius: 10,
        },
        // Add other styles here
    };


    const fetchData = async () => {
        try {
            const data = await AsyncStorage.getItem('userData');
            if (data !== null) {
                setUserData(JSON.parse(data));
                console.log('---------------==============>', data);
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
        setUserPhone(item.userPhoneNo);
        // console.log(item.userPhoneNo,'0000000000000000000000000000')
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
        const formData = new FormData();
        formData.append('name', username);
    // formData.append('username', useremail);
    //   formData.append('userPhoneNo', userPhone);

        if (pickImage) {
            formData.append('Ownerimage', {
                uri: pickImage,
                type: 'image/jpeg',
                name: 'icon.jpg',
            });
        }

        try {
            const response = await axios.put(`https://app.guardx.cloud/api/editAdminimage/${modalId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Upload response:', response.data.message);
        fetchData()
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <View style={styles.mainContianer}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.replace('Main')}
                    style={styles.backButton}>
                    <Image
                        source={require('../../../assets/Image/back.png')}
                        style={[styles.backImage]}
                    />
                </TouchableOpacity>
                <Text style={[styles.headingtxt, { marginLeft: '8%', fontSize: isTablet ? 42 : 32 }]}>{t('Profiles')}</Text>
                <TouchableOpacity onPress={() => openModal(userData)} style={{ width: isTablet ? 140 : 80, height: isTablet ? 50 : 30, marginRight: isTablet ? 20 : 15, borderWidth: .7, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderRadius: 8 }}>
                    <Text style={styles.headingtxt}>{t('Edit')}</Text>



                    <Image
                        source={require('../../../assets/Image/edit.png')}
                        style={{ width: isTablet ? 20 : 15, height: isTablet ? 20 : 15 }}
                    />


                </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', marginTop: '7%' }}>
                <View style={{ width: isTablet ? 200 : 100, height: isTablet ? 200 : 100, borderWidth: 1, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                    {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={{ width: isTablet ? 200 : 100, height: isTablet ? 200 : 100, borderRadius: 100 }}
                        />
                    ) : (
                        <Text>No image</Text>
                    )}
                </View>

                <View style={{ marginTop: 20, width: '100%', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: isTablet ? 200 : 200, height: isTablet ? 300 : 220, justifyContent: 'center' }}>
                            <Text style={[styles.txt, { fontSize: isTablet ? 32 : 22, textAlign: 'right' }]}>Name :</Text>
                            <Text style={[styles.txt, { fontSize: isTablet ? 32 : 22, textAlign: 'right' }]}>Email :</Text>
                            <Text style={[styles.txt, { fontSize: isTablet ? 32 : 22, textAlign: 'right' }]}>Phone No :</Text>
                            <Text style={[styles.txt, { fontSize: isTablet ? 32 : 22, textAlign: 'right' }]}>Role :</Text>
                        </View>

                        <View style={{ width: isTablet ? 500 : 300, height: isTablet ? 300 : 220, justifyContent: 'center', marginLeft: 10 }}>
                            <Text style={[styles.txt, { fontSize: isTablet ? 32 : 20, textAlign: 'left' }]}>{userData.name || 'N/A'}</Text>
                            <Text style={[styles.txt, { fontSize: isTablet ? 32 : 20, textAlign: 'left' }]}>{userData.username || 'N/A'}</Text>
                            <Text style={[styles.txt, { fontSize: isTablet ? 32 : 20, textAlign: 'left' }]}>{parseInt(userData.userPhoneNo)}</Text>
                            <Text style={[styles.txt, { fontSize: isTablet ? 32 : 20, textAlign: 'left', marginTop: isTablet ? 0 : 5 }]}>{userData.role || 'N/A'}</Text>
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
                    <View style={[styles.modalContent, {
                        width: isTablet ? 600 : 300,
                        height: isTablet ? 700 : 500
                    }]}>
                        <ScrollView>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                                <Text style={[styles.headingtxt, { marginLeft: '35%', fontSize: isTablet ? 42 : 32 }]}>{t('Edit')}</Text>
                                <TouchableOpacity onPress={closeEditModal}>
                                    <Image
                                        source={require('../../../assets/Image/close.png')}
                                        style={{ width: isTablet ? 30 : 15, height: isTablet ? 30 : 15, marginRight: 20 }}
                                    />
                                </TouchableOpacity>




                            </View>
                            <View style={{ alignItems: 'center', marginTop: '5%' }}>
                                <View style={{
                                    width: isTablet ? 150 : 100,
                                    height: isTablet ? 150 : 100,
                                    borderWidth: 1,
                                    borderRadius: 60,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'relative' // Add relative positioning to the container
                                }}>
                                    {pickImage || imageUrl ? (
                                        <Image
                                            source={{ uri: pickImage || imageUrl }}
                                            style={{
                                                width: isTablet ? 150 : 95,
                                                height: isTablet ? 150 : 95,
                                                borderRadius: 70
                                            }}
                                        />
                                    ) : (
                                        <Text>No image available</Text>
                                    )}

                                    <TouchableOpacity onPress={() => handleImagePicker()}
                                        style={{
                                            width: isTablet ? 30 : 20,
                                            height: isTablet ? 30 : 20,
                                            backgroundColor: '#fff',
                                            elevation: 5,
                                            borderRadius: 15,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            position: 'absolute',
                                            right: -1,  // Adjust to position inside the container
                                            bottom: 10, // Adjust to position inside the container
                                        }}>
                                        <Image
                                            source={require('../../../assets/Image/edit.png')}
                                            style={{ width: isTablet ? 20 : 15, height: isTablet ? 20 : 15 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{ width: '100%', alignItems: 'center' }}>


                                <View style={{ marginTop: '5%' }}>
                                    <Text style={styles.txt}>{t('UserName')}*</Text>
                                    <View style={{ marginTop: 10, flexDirection: 'row', width: '30%', height: 50, backgroundColor: '#e5e5e5', alignItems: 'center', borderRadius: 10 }}>

                                        <TextInput value={username} style={{ width: isTablet ? 300 : 200, height: 40, color: '#000', fontSize: isTablet ? 22 : 15, paddingLeft: 15 }} onChangeText={(txt) => setUserName(txt)} />
                                    </View>
                                </View>
                                <View style={{ marginTop: '2%' }}>
                                    <Text style={styles.txt}>{t('UserEmail')}*</Text>
                                    <View style={{ marginTop: 10, flexDirection: 'row', width: '30%', height: isTablet ? 50 : 40, backgroundColor: '#e5e5e5', alignItems: 'center', borderRadius: 10 }}>

                                        <TextInput value={useremail} style={{ width: isTablet ? 300 : 200, height: isTablet ? 50 : 40, color: '#000', fontSize: isTablet ? 22 : 15, paddingLeft: 15 }} onChangeText={(txt) => setUserEmail(txt)} />
                                    </View>
                                </View>
                                <View style={{ marginTop: '2%' }}>
                                    <Text style={styles.txt}>{t('userPhoneNo')}*</Text>
                                    <View style={{ marginTop: 10, flexDirection: 'row', width: isTablet ? 300 : 200, height: isTablet ? 50 : 30, backgroundColor: '#e5e5e5', alignItems: 'center', borderRadius: 10 }}>

                                        <TextInput value={Number(userPhone).toString()} style={{ width: isTablet ? 300 : 200, height: isTablet ? 50 : 40, color: '#000', fontSize: isTablet ? 22 : 15, paddingLeft: 15 }} onChangeText={(txt) => setUserPhone(txt)} />
                                    </View>
                                </View>

                                <TouchableOpacity onPress={() => { handleEditData(), setModalEditVisible(false) }} style={{ width: isTablet ? 200 : 100, height: isTablet ? 60 : 40, backgroundColor: '#f64f6d', alignSelf: 'center', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: '9%', marginBottom: 20 }}>
                                    <Text style={{ fontSize: isTablet ? 33 : 20, color: '#fff', fontWeight: '500' }}>{t('Save')}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default ProfileGuard

const styles = StyleSheet.create({
    mainContianer: { flex: 1, backgroundColor: '#fff' },
    headingtxt: {

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
        width: 40, height: 40
    },
    txt: {
        color: '#000', fontWeight: '500'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {

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