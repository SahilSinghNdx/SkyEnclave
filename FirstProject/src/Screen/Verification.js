import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert, Modal, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../Config';
const { width, height } = Dimensions.get('window');

const Logo = require('../../assets/Image/camera.png');
const Logo1 = require('../../assets/Image/adhaar.png');

const Verification = ({ navigation, route }) => {
    const [filePath, setFilePath] = useState([]);
    const [images, setImages] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selecteduserimage, setSelectedUserImage] = useState(null);

    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [data, setData] = useState({});
    const [data3, setData3] = useState({});
    const [data4, setData4] = useState({});
    const [userData, setUserData] = useState({});
    const currLang = route.params.currLang;

    // console.log('99999999999999', data)
    // console.log('data3', data3)
    // console.log('data4', data4)
    // console.log('Society_ID ', userData)
    // console.log(' images ---------------->', images);

    const isTablet = width > 600;

    const styles = {
        imageStyle: {
            width: isTablet ? 300 : 150, // Larger size for tablets
            height: isTablet ? 250 : 150,
            borderRadius: 10,
        },
        // Add other styles here
    };

    const openImagePicker = () => {
        // Check if there are fewer than 2 images
        if (filePath.length < 3) {
            // Define options for the camera
            const options = {
                mediaType: 'photo', // Only allow photos
                includeBase64: false, // Do not include base64 data
            };

            // Launch the camera
            launchCamera(options, (response) => {
                if (response.didCancel) {
                    // User cancelled the image picker
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    // Handle the error
                    console.error('Image picker error: ', response.error);
                } else {
                    // Get the image URI from the response
                    let imageUri = response.uri || response.assets?.[0]?.uri;
                    if (imageUri) {
                        // Update the filePath state with the new image URI
                        setFilePath((prevFilePath) => [...prevFilePath, imageUri]);
                    }
                }
            });
        } else {
            Alert.alert(t('YouAdd3Img'));
        }
    };

    const AddCardPicker = () => {
        if (images.length < 2) {
            const options = {
                mediaType: 'photo',
                includeBase64: false,
            };
            launchCamera(options, (response) => {
                if (response.didCancel) {
                    //  console.log('User cancelled image picker');
                } else if (response.error) {
                    //   console.log('Image picker error: ', response.error);
                } else {
                    let imageUri = response.uri || response.assets?.[0]?.uri;
                    setImages([...images, imageUri]);
                }
            });
        } else {
            Alert.alert(t('Limit'), t('Cautions'));
        }
    };

    const { t } = useTranslation();

    const handleSubmit = () => {
        if (filePath.length > 0) {
            setModalVisible(true);
        } else {
            //  handlePostApiData()

            Alert.alert(t('Error'), t('AlertVerfication'));
        }
    };

    const handleModalClose = () => {
        handlePostApiData()
        setModalVisible(false);
        Alert.alert(t('DataAdded'))
        navigation.navigate('Main');
    };

    const handleDelete = (index, type) => {
        if (type === 'image') {
            let updatedImages = images.filter((img, i) => i !== index);
            setImages(updatedImages);
        } else if (type === 'filePath') {
            setFilePath([]);
        }
    };

    const handleUserDelete = (index, type) => {
        if (type === 'filePath') {
            let updatedImages = filePath.filter((img, i) => i !== index);
            setFilePath(updatedImages);
        } else if (type === 'filePath') {
            setFilePath([]);
        }
    };

    const openImageModal = (imageUri) => {
        setSelectedImage(imageUri);
        setImageModalOpen(true);
    };

    const openUserModal = (imageUri) => {
        setSelectedUserImage(imageUri);
        setUserModalOpen(true);
    }; 
    
    const handlePostApiData = async () => {
        try {
            //  First append the data
            const formData = new FormData();
            formData.append('entryType', data.entryType);
            formData.append('purposeType', data3.purpose);
            formData.append('houseDetails', data4.houseNo);
            formData.append('society_id', userData.society_id);

            // formData.append('image', {
            //     uri: filePath,
            //     type: 'image/jpeg',
            //     name: 'MeraPhoto.jpg',
            // });

            if (Array.isArray(filePath)) {
                filePath.forEach((uri, index) => {
                   
                    formData.append('image', {
                        uri: uri,
                        type: 'image/jpeg', 
                        name: 'image.jpg', 
                    });
                });
            } else {
               // console.error('filePath is not an array or is undefined:', filePath);
                return;
            }


            if (Array.isArray(images)) {
                images.forEach((uri, index) => {
                    // Convert URI to a suitable object for FormData
                    formData.append('aadharImage', {
                        uri: uri,
                        type: 'image/jpeg', 
                        name: 'image.jpg', 
                    });
                });
            } else {
               // console.error('filePath is not an array or is undefined:', images);
                return;
            }
            const response = await axios.post(`${BASE_URL}/nonVerified`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            //   console.log("Response im getting from the api ---> ", response.data)
        } catch (err) {
            //  console.log(err)
        }
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const fetchedData = await AsyncStorage.getItem('Occasional');
                setData(JSON.parse(fetchedData));

                const fetchedData3 = await AsyncStorage.getItem('Purpose');
                setData3(JSON.parse(fetchedData3));

                const fetchedData4 = await AsyncStorage.getItem('Visit');
                setData4(JSON.parse(fetchedData4));

                const fetchedUserData = await AsyncStorage.getItem('userData');
                setUserData(JSON.parse(fetchedUserData));
            } catch (error) {
                //  console.error("Error fetching data from AsyncStorage", error);
            }
        };
        getData();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, width: '100%', }}>

                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20 }}>
                        <Image source={require('../../assets/Image/back.png')} style={{ width: 40, height: 40 }} />
                    </TouchableOpacity>
                    <View>
                        <Text
                            style={{
                                fontSize: 22,
                                fontWeight: '700',
                                color: '#000',
                                textAlign: 'center',
                            }}>
                            {t('Verification')}
                        </Text>
                    </View>
                </View>

            </View>

            <View style={{ flex: 1, backgroundColor: '#fff', padding: 20, marginTop: 50 }}>
                {isTablet ? (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <View style={{ marginLeft: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{
                                width: filePath.length === 0 ? (isTablet ? 260 : 120) : (isTablet ? 600 : 200),
                                height: filePath.length === 0 ? (isTablet ? 290 : 400) : (isTablet ? 290 : 400),
                                borderWidth: 2,
                                borderStyle: 'dashed',
                                borderRadius: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 3,
                                backgroundColor:'green'
                             
                            }}>
                                {
                                    filePath.length === 0 ?
                                        <Image source={Logo} style={{ width: isTablet ? 120 : 80, height: isTablet ? 120 : 60 }} /> :
                                        <FlatList
                                            data={filePath}
                                            horizontal
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item, index }) => (
                                                <TouchableOpacity onPress={() => openUserModal(item)} style={{ flexWrap: 'wrap' }}>
                                                    <Image source={{ uri: item }} style={{ width: isTablet ? 170 : 90, height: isTablet ? 170 : 100, borderRadius: 10, margin: 10 }} />
                                                    <TouchableOpacity onPress={() => handleUserDelete(index, 'filePath')} style={{ position: 'absolute', right: 5, top: 7 }}>
                                                        <Image source={require('../../assets/Image/close.png')} style={{ width: isTablet ? 30 : 15, height: isTablet ? 30 : 15, margin: 10 }} />
                                                    </TouchableOpacity>
                                                </TouchableOpacity>
                                            )}
                                        />
                                }
                            </View>
                            <TouchableOpacity
                                onPress={() => openImagePicker()}
                                style={{
                                    alignSelf: filePath.length === 0 ? 'flex-start' : 'center',
                                    marginTop: isTablet ? 10 : 15
                                }}
                            >
                                <Text style={{ fontSize: 22, color: 'blue', fontWeight: '500', marginLeft: filePath.length === 0 ? 60 : 0 }}>
                                    {filePath.length === 0 ? t('TakePhoto') : t('AddMore')}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Adhar Card Images Section */}
                        <View style={{ marginLeft: 10 }}>
                            <View>
                                {
                                    images.length === 0 ?
                                        <Image source={Logo1} style={{ width: isTablet ? 500 : 200, height: isTablet ? 300 : 130, resizeMode: 'contain' }} /> :
                                        <FlatList
                                            data={images}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            style={{ flexGrow: 0 }}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item, index }) => (
                                                <TouchableOpacity onPress={() => openImageModal(item)} style={{ flexWrap: 'wrap' }}>
                                                    <Image source={{ uri: item }} style={{ width: isTablet ? 300 : 100, height: isTablet ? 280 : 120, borderRadius: 10, margin: 10 }} />
                                                    <View style={{ position: 'absolute', top: 15, right: 15 }}>
                                                        <TouchableOpacity onPress={() => handleDelete(index, 'image')}>
                                                            <Image source={require('../../assets/Image/close.png')} style={{ width: isTablet ? 30 : 15, height: isTablet ? 30 : 15 }} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </TouchableOpacity>
                                            )}
                                        />
                                }
                            </View>
                            <TouchableOpacity onPress={() => AddCardPicker()}>
                                <Text style={{ fontSize: 22, color: 'blue', fontWeight: '500', textAlign: 'center' }}>
                                    {images.length === 0 ? t('VerifyAdharCard') : t('AddMore')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View >
                        <View style={{
                            width: filePath.length == 0 ? '50%' : '90%',
                            height: filePath.length == 0 ?150 : 200,
                            borderWidth: 2,
                            borderStyle: 'dashed',
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                           // marginTop: 3,
                                alignSelf: 'center',
                                backgroundColor:'red'
                               
                        }}>
                            {
                                filePath.length === 0 ?
                                    <Image source={Logo} style={{ width: isTablet ? 120 : 80, height: isTablet ? 120 : 60 }} /> :
                                    <FlatList
                                        data={filePath}
                                        horizontal
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) => (
                                            <TouchableOpacity onPress={() => openUserModal(item)} style={{ flexWrap: 'wrap' }}>
                                                <Image source={{ uri: item }} style={{ width: isTablet ? 170 : 90, height: isTablet ? 170 : 150, borderRadius: 10, margin: 5, resizeMode: "contain" }} />
                                                <TouchableOpacity onPress={() => handleUserDelete(index, 'filePath')} style={{ position: 'absolute', right: 9, top: 23, backgroundColor: 'white', borderRadius: 100, height: 20, width: 20, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image source={require('../../assets/Image/close.png')} style={{ width: isTablet ? 30 : 10, height: isTablet ? 30 : 10, margin: 10 }} />
                                                </TouchableOpacity>
                                            </TouchableOpacity>
                                        )}
                                    />
                            }
                        </View>
                        <TouchableOpacity
                            onPress={() => openImagePicker()}
                            style={{
                                alignSelf: 'center', 
                                marginTop: 6
                            }}
                        >
                            <Text style={{ fontSize: 22, color: 'blue', fontWeight: '500' }}>
                                {filePath.length === 0 ? 'Take a Photo' : 'Add More'}
                            </Text>
                        </TouchableOpacity>

                        <View style={{ marginTop: 50 }}>
                            <View style={{ width: '100%', justifyContent: 'center', alignItems: "center",backgroundColor:'orange' }}>
                                {
                                    images.length === 0 ?
                                        <Image source={Logo1} style={{ width: '100%', height: 130, resizeMode: 'contain' }} /> :
                                        <FlatList
                                            data={images}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            style={{ flexGrow: 0 }}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item, index }) => (
                                                <TouchableOpacity onPress={() => openImageModal(item)} style={{ flexWrap: 'wrap', alignSelf: 'center' }}>
                                                    <Image source={{ uri: item }} style={{ width:150, height:150, borderRadius: 10, margin: 10 }} />
                                                    <View style={{ position: 'absolute', right:15, top:20, backgroundColor: 'white', borderRadius: 100, height: 20, width: 20, justifyContent: 'center', alignItems: 'center' }}>
                                                        <TouchableOpacity onPress={() => handleDelete(index, 'image')}>
                                                            <Image source={require('../../assets/Image/close.png')} style={{ width: 10, height:10 }} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </TouchableOpacity>
                                            )}
                                        />
                                }
                            </View>
                            <TouchableOpacity onPress={() => AddCardPicker()}>
                                <Text style={{ fontSize: 22, color: 'blue', fontWeight: '500', textAlign: 'center',marginTop:5 }}>
                                    {images.length === 0 ? 'Verify AdharCard' : 'Add More'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>

           
                <TouchableOpacity onPress={() => handleSubmit()} style={{ width: '70%', height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#33ACFF', borderRadius: 20, alignSelf: 'center', marginBottom:50 }}>
                    <Text style={{ fontSize: 33, color: '#fff', fontWeight: '600' }}>{t('Submit')}</Text>
                </TouchableOpacity>
   

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={Styles.centeredView}>
                    <View style={[Styles.modalView, {
                        width: isTablet ? 520 : 350,
                        height: isTablet ? 250 : 200
                    }]}>
                        <Text style={[Styles.modalText, { fontSize: isTablet ? 35 : 23, }]}>{t('ModalTxt')}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 35 }}>
                            <TouchableOpacity onPress={() => handleModalClose()} style={[Styles.modalButton, {
                                backgroundColor: '#33ACFF', marginLeft: '15%', width: isTablet ? 150 : 100, height: 60
                            }]}>
                                <Text style={[Styles.modalButtonText, { fontSize: isTablet ? 25 : 20, }]}>{t('Save')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={[Styles.modalButton, {
                                backgroundColor: 'red', marginRight: '15%', width: isTablet ? 150 : 100, height: 60,
                            }]}>
                                <Text style={[Styles.modalButtonText, { fontSize: isTablet ? 25 : 20, }]}>{t("Don't")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={imageModalOpen}
                onRequestClose={() => setImageModalOpen(false)}>
                <View style={Styles.centeredView}>
                    {selectedImage && (
                        <Image source={{ uri: selectedImage }} style={{ width: isTablet ? 500 : 300, height: isTablet ? 600 : 300, borderRadius: 10, resizeMode: 'contain' }} />
                    )}
                    <View style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 30, marginRight: 25, backgroundColor: '#fff', padding: 15, borderRadius: 30
                    }}>
                        <TouchableOpacity
                            onPress={() => setImageModalOpen(false)}

                        >
                            <Image source={require('../../assets/Image/close.png')} style={{ width: isTablet ? 30 : 20, height: isTablet ? 30 : 20 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            <Modal
                animationType="slide"
                transparent={true}
                visible={userModalOpen}
                onRequestClose={() => setUserModalOpen(false)}>
                <View style={Styles.centeredView}>
                    {selecteduserimage && (
                        <Image source={{ uri: selecteduserimage }} style={{ width: isTablet ? 500 : 300, height: isTablet ? 600 : 300, borderRadius: 10, resizeMode: 'contain' }} />
                    )}
                    <View style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 30, marginRight: 25, backgroundColor: '#fff', padding: 15, borderRadius: 30
                    }}>
                        <TouchableOpacity
                            onPress={() => setUserModalOpen(false)}

                        >
                            <Image source={require('../../assets/Image/close.png')} style={{ width: isTablet ? 30 : 20, height: isTablet ? 30 : 20 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};


export default Verification;

const Styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {

        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 2,
    },
    modalText: {
        textAlign: 'center',

        color: '#000',
        marginTop: 30,
        fontWeight: '600',
    },
    modalButton: {

        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    modalButtonText: {

        color: '#fff',
        fontWeight: '600',
    },
    deleteIcon: {
        position: 'absolute',
        top: 15,
        left: 5,
        marginLeft: 15
    },
    modalViewImage: {
        width: '70%',
        height: '70%',
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 2,
        padding: 20,
    },
});

