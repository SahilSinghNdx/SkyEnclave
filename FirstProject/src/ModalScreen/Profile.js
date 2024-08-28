import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal
} from 'react-native';
import React, { useEffect, useState } from 'react';
import MyTextView from '../Component/MyTextView';
import MySubmitBtn from '../Component/MySubmitBtn';
import { GET_SOCIETY_DATA } from '../Config';
import axios from 'axios';
import MyModalInput from '../Component/MyModalInput';

const Profile = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        axios
            .get(GET_SOCIETY_DATA)
            .then(response => {
                setData(response.data.societyData);
                console.log('Data from API: -----------------------------------> ', response.data.societyData);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    console.log('Data:', data);

    const toggleModal = () => {
        setOpenModal(!openModal);
    };

    return (
        <ScrollView style={styles.maincontainer}>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={require('../../assets/Image/back.png')}
                        style={styles.image}
                    />
                </TouchableOpacity>

                <Text style={styles.text}>{'Profile'}</Text>

                <TouchableOpacity
                    style={styles.editButtonContainer}
                    onPress={toggleModal}>
                    <Text style={styles.editButtonText}>Edit</Text>
                    <Image
                        source={require('../../assets/Image/newedit.png')}
                        style={styles.editButtonIcon}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.imageView}>
                <Image
                    source={require('../../assets/Image/man1.png')}
                    style={styles.profileImage}
                />
                <TouchableOpacity style={styles.editIconContainer}>
                    <Image
                        source={require('../../assets/Image/edit.png')}
                        style={styles.editIcon}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.infoContainer}>

                {data.map(item => {
                    // console.log('fghtfhghgg', item)
                    return (
                        <View>
                            <MyTextView text={item.name} />
                            {/* <MyTextView text={item.password} /> */}
                            {/* <MyTextView text={item.contactName} />
                            <MyTextView text={item.role} /> */}
                        </View>

                    )
                })}



                {/* <MyTextView text={data && data.address} />
                <MyTextView text={data?.password} />
                <MyTextView text={data?.userPhoneNumber || "Loading..."} />
                <MyTextView text={data.role} /> */}
            </View>

            <View style={styles.buttonContainer}>
                <MySubmitBtn title={'Save'} />
            </View>

            <Modal
                visible={openModal}
                onBackdropPress={toggleModal}
                animationType="slide"
                transparent={true}>
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>

                        <Text style={styles.modalTitle}>Edit Profile</Text>

                        <MyModalInput placeholder={'Enter Name'} />
                        <MyModalInput placeholder={'Enter Email'} />

                        <MyModalInput placeholder={'Enter Phone Number'} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: '8%' }}>
                            <TouchableOpacity style={{ width: '30%', height: 70, borderRadius: 10, backgroundColor: '#33ACFF', marginLeft: '4%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 32, color: '#fff', fontWeight: '600' }}>{'Save'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => toggleModal()} style={{ width: '30%', height: 70, borderRadius: 10, backgroundColor: 'red', marginRight: '4%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 32, color: '#fff', fontWeight: '600' }}>{'Close'}</Text>


                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
        justifyContent: 'space-between',
    },
    image: {
        width: 70,
        height: 50,
        marginLeft: 20,
    },
    text: {
        fontSize: 52,
        color: 'black',
        fontWeight: '500',
    },
    editButtonContainer: {
        width: 100,
        height: 50,
        backgroundColor: '#E7E1DF',
        marginRight: 30,
        flexDirection: 'row',
        borderRadius: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    editButtonText: {
        fontSize: 22,
        color: 'black',
        fontWeight: '600',
        marginLeft: 15,
    },
    editButtonIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    imageView: {
        alignItems: 'center',
        marginTop: 20,
        width: '15%',
        alignSelf: 'center',
    },
    profileImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    editIconContainer: {
        width: 30,
        height: 30,
        bottom: 20,
        position: 'absolute',
        right: 10,
        elevation: 2,
    },
    editIcon: {
        width: 30,
        height: 30,
    },
    infoContainer: {
        marginTop: 30,
    },
    buttonContainer: {
        marginTop: 40,
        marginBottom: 20,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '55%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        height: 600
    },

    modalTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#000'
    },
});

export default Profile;
