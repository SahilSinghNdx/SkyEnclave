import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, FlatList, Modal, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DELETE_USER_WITH_SOCIETY_USER, GET_ROLE, GET_USER_WITH_SOCIETY_USER } from '../Config';
import axios, { Axios } from 'axios';
import CommonTxtInput from '../Component/CommonTxtInput';
import { Switch } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Admin = ({ route, navigation }) => {
    const [newData, setNewData] = useState([]);

    const [data, setData] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [EditmodalVisible, setEditModalVisible] = useState(false);

    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [role, setRole] = useState('');

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [confirmpasswordError, setConfirmpasswordError] = useState('');
    const [roleError, setRoleError] = useState('');
    const [status, setStatus] = useState(false);
    const [statusError, setStatusError] = useState('');
    const [userID, setUserID] = useState('')
    const [filteredDatas, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState();
    const [newemail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const [newconfirmpassword, setNewConfirmPassword] = useState('');
    const [newrole, setNewRole] = useState('');
    const [newstatus, setNewStatus] = useState(false);
    const [modalId, setModalId] = useState('')


    const fetchRolesData = async () => {
        try {
            const response = await axios.get(GET_ROLE);

            if (response.data && Array.isArray(response.data.roles)) {
                console.log(response.data.roles, '--------------------->');
                // Extract unique roles from the user data
                const uniqueRoles = [...new Set(response.data.roles.map(item => item.title))];

                // Map roles data to dropdown format
                const rolesData = uniqueRoles.map(role => ({
                    label: role,
                    value: role,
                }));

                console.log('Roles Data:', rolesData);
                setNewData(rolesData);
            } else {
                console.error('Roles data not found or is not an array');
            }
        } catch (error) {
            console.error('Error fetching roles data:', error);
        }
    };




    const fetchData = async () => {
        try {
            const storedUserID = await AsyncStorage.getItem('userID');
            if (storedUserID) {
                console.log('Stored User ID:', storedUserID);
                setUserID(storedUserID);

                const response = await axios.get(GET_USER_WITH_SOCIETY_USER); 

                if (response.data.data) {
                    setData(response.data.data);
                    const filteredData = response.data.data.filter(item => item.createdBy === storedUserID);
                    setFilteredData(filteredData);
                    setData(filteredData);
                    console.log('Filtered Data:', filteredData);

                    // Fetch roles data after filtering the users
                    fetchRolesData(filteredData);
                }
            } else {
                console.error('No user ID found in AsyncStorage');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const onToggleSwitch = (value) => {
        setIsSwitchOn(value);
    };
    const openModal = () => setModalVisible(true);

    const closeModal = () => {
        resetFields();
        setModalVisible(false);
    };

    const validateFields = () => {
        let isValid = true;

        if (!email) {
            setEmailError('Email is required');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!phone) {
            setPhoneError('Phone number is required');
            isValid = false;
        } else {
            setPhoneError('');
        }

        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (!confirmpassword) {
            setConfirmpasswordError('Confirm password is required');
            isValid = false;
        } else if (password !== confirmpassword) {
            setConfirmpasswordError('Passwords do not match');
            isValid = false;
        } else {
            setConfirmpasswordError('');
        }

        if (!role) {
            setRoleError('Role is required');
            isValid = false;
        } else {
            setRoleError('');
        }

        if (status === undefined || status === null) { // Ensure status is correctly checked
            setStatusError('Status is required');
            isValid = false;
        } else {
            setStatusError('');
        }

        console.log('Validation Result:', isValid);
        return isValid;
    };

    const handleDeleteEntry = async (delete_id) => {
        console.log(delete_id, '------------------>')
        try {
            const response = await axios.delete(`${DELETE_USER_WITH_SOCIETY_USER}/${delete_id}`);
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


    const handleSearch = (text) => {
        setSearchQuery(text);
        const filtered = data.filter(item =>
            item.username && item.username.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filtered);
    };
    const resetFields = () => {
        setEmail('');
        setEmailError('');
        setPhone('');
        setPhoneError('');
        setPassword('');
        setPasswordError('');
        setConfirmPassword('');
        setConfirmpasswordError('')
        setRole('')
        setRoleError('')
        setStatus('')
    };
    
    const createId = (role) => {
        switch (role) {
            case "GuardLevel":
            case "SocietySubAdmin":
                return 5;
            default:
                return 5;
        }
    }

    const handleCreateUser = async () => {
        if (validateFields()) {
            const idLevel = createId(role);
            const societyId = await AsyncStorage.getItem('userID');
            console.log("Socity", societyId)
            console.log("level is -> ", idLevel)
            const newEntry = {
                username: email,
                phon: phone,
                password: password,
                confirmpassword: confirmpassword,
                role: role,
                isActive: isSwitchOn,
                createdBy: userID,
                defaultPermissionLevel: idLevel,
                society_id: societyId
            };
            console.log('New Entry:', newEntry);


            

            try {
                const response = await axios.post('https://app.guardx.cloud/api/signup', newEntry);
                if (response.data.success) {
                    // Handle successful response
                    console.log('Role created successfully:', response.data);

                    resetFields();
                    setModalVisible(false);
                    fetchData();
                } else {
                    // Handle unsuccessful response
                    console.error('API Response Error:', response.data.message || 'Unknown error');
                }
            } catch (error) {
                console.error('Error posting data:', error.response ? error.response.data : error.message);
            }
        } else {
            console.log('kya baat h bhai')
        }
    }
    const handleItemClick = (item) => {
        console.log(item, 'jai shree ram-------------->')
        setModalId(item._id)
        setEditModalVisible(true)
        setSelectedItem(item)
        setNewEmail(item.username)
        setNewPhone(item.userPhoneNo.toString());
        // console.log("New phone nu,bnerjle---> ", item.userPhoneNo);
        setNewPassword(item.password)
        setNewConfirmPassword(item)
        setNewRole(item.role)
        console.log("ITem is true ?", newstatus);
        setNewStatus(item.isActive === true);

    };
    const closeModaledit = () => {
        setEditModalVisible(false);
        //  setSelectedItem(null);
    };
    const handleUpdateUser = async () => {
        console.log("hello user this is new data --> ", newemail, newPhone, newpassword, newrole, newstatus);
        const formData = {
            "username": newemail,
            "userPhoneNo": newPhone,
            "password": newpassword,
            "role": newrole,
            "isActive": newstatus
        }

        console.log('------------------------------------------->', formData)
        try {
            const response = await axios.put(`https://app.guardx.cloud/api/editSignUpUser/${modalId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Upload response: is here --> ', response.data);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

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
                <Text style={styles.headingtxt}>List of User</Text>
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
                        onPress={openModal}
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
                        <Text style={styles.headerText}>UserEmail</Text>
                    </View>
                    <View style={{ width: '13%' }}>
                        <Text style={styles.headerText}>Password</Text>
                    </View>
                    <View style={{ width: '13%' }}>
                        <Text style={styles.headerText}>Status</Text>
                    </View>

                    <View style={{ width: '13%' }}>
                        <Text style={styles.headerText}>Role</Text>
                    </View>

                    <View style={{ width: '13%' }}>
                        <Text style={styles.headerText}>Actions</Text>
                    </View>
                </View>
            </View>

            <FlatList
                data={filteredDatas}
                renderItem={({ item, index }) => {
                    return (
                        <View style={styles.itemContainer}>
                            <View style={{ width: 190 }}>
                                <Text style={[styles.itemText, { marginLeft: 5 }]}>
                                    {item.username}
                                </Text>
                            </View>


                            <View style={{ width: 100 }}>
                                <Text style={[styles.itemText, {}]}>
                                    {item.password}
                                </Text>
                            </View>

                            <View style={{ width: 140 }}>
                                <Text style={[styles.itemText, { marginLeft: 25 }]}>
                                    {item.isActive ? 'Active' : 'InActive'}
                                </Text>
                            </View>

                            <View style={{ width: 150 }}>
                                <Text style={[styles.itemText, {}]}>
                                    {item.role}
                                </Text>
                            </View>


                            <View style={[styles.itemCenter, { marginRight: '2%' }]}>
                                <TouchableOpacity onPress={() => handleItemClick(item)}>
                                    <Image
                                        source={require('../../assets/Image/Edit1.png')}
                                        style={[styles.deleteIcon, { marginLeft: 30 }]} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => handleDeleteEntry(item._id)}>
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
                onShow={resetFields}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <ScrollView>
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
                                        fontSize: 33,
                                        color: '#000',
                                        fontWeight: '700',
                                        textAlign: 'center',
                                        // marginTop: 10,
                                    }}>
                                    Add User
                                </Text>
                            </View>
                            <View style={{ width: '100%', marginTop: '5%', marginLeft: '5%' }}>

                                <View>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Email*
                                    </Text>
                                    <CommonTxtInput
                                        placeholder={'Enter Email Here..'}
                                        style={[styles.input]}
                                        autoFocus
                                        value={email}
                                        onChangeText={(text) => { setEmail(text), setEmailError('') }}
                                    />
                                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                                </View>
                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Phone Number*
                                    </Text>
                                    <CommonTxtInput
                                        placeholder={'Enter Phone Number Here..'}
                                        style={[styles.input]}
                                        autoFocus
                                        value={phone}
                                        keyboardType={'number-pad'}
                                        maxLength={10}
                                        onChangeText={(text) => { setPhone(text), setPhoneError('') }}
                                    />
                                    {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

                                </View>

                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Password*
                                    </Text>
                                    <CommonTxtInput
                                        placeholder={'Enter Password Here..'}
                                        style={[styles.input]}
                                        autoFocus
                                        value={password}
                                        onChangeText={(text) => { setPassword(text), setPasswordError('') }}
                                    />
                                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                                </View>

                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Confirm Password*
                                    </Text>
                                    <CommonTxtInput
                                        placeholder={'Enter Confirm Password Here..'}
                                        style={[styles.input]}
                                        autoFocus
                                        value={confirmpassword}
                                        onChangeText={(text) => { setConfirmPassword(text), setConfirmpasswordError('') }}
                                    />
                                    {confirmpasswordError ? <Text style={styles.errorText}>{confirmpasswordError}</Text> : null}

                                </View>
                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Role*
                                    </Text>
                                    <Dropdown
                                        style={styles.dropdown}
                                        data={newData}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select Role"
                                        value={role}
                                        onChange={item => {
                                            setRole(item.value);
                                            setRoleError('')
                                        }}
                                    />
                                    {roleError ? <Text style={styles.errorText}>{roleError}</Text> : null}

                                </View>
                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Status*
                                    </Text>
                                    <Switch value={isSwitchOn} onValueChange={onToggleSwitch} style={{ width: 60, height: 70 }} color='red' />
                                    {/* //  {statusError ? <Text style={styles.errorText}>{statusError}</Text> : null} */}

                                </View>

                                <TouchableOpacity
                                    onPress={handleCreateUser}
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
                                        Create User
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
                visible={EditmodalVisible}
                onRequestClose={closeModaledit}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <ScrollView>
                            <View style={styles.modalContent}>
                                <TouchableOpacity
                                    onPress={closeModaledit}
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
                                    Edit User
                                </Text>
                            </View>
                            <View style={{ width: '100%', marginTop: '5%', marginLeft: '5%' }}>

                                <View>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Email*
                                    </Text>
                                    <CommonTxtInput
                                        placeholder={'Enter Email Here..'}
                                        style={[styles.input]}
                                        autoFocus
                                        value={newemail}
                                        onChangeText={(text) => { setNewEmail(text), setEmailError('') }}
                                    />
                                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                                </View>
                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Phone Number*
                                    </Text>
                                    <CommonTxtInput
                                        placeholder={'Enter Phone Number Here..'}
                                        style={[styles.input]}
                                        autoFocus
                                        value={newPhone}
                                        keyboardType={'number-pad'}
                                        // maxLength={10}
                                        onChangeText={(text) => { setNewPhone(text), setPhoneError('') }}
                                    />

                                    {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

                                </View>

                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Password*
                                    </Text>
                                    <CommonTxtInput
                                        placeholder={'Enter Password Here..'}
                                        style={[styles.input]}
                                        autoFocus
                                        value={newpassword}
                                        onChangeText={(text) => { setNewPassword(text), setPasswordError('') }}
                                    />
                                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                                </View>


                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Role*
                                    </Text>
                                    <Dropdown
                                        style={styles.dropdown}
                                        data={newData}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select Role"
                                        value={newrole}
                                        onChange={item => {
                                            setNewRole(item.value);
                                            setRoleError('')
                                        }}
                                    />
                                    {roleError ? <Text style={styles.errorText}>{roleError}</Text> : null}

                                </View>
                                <View style={{ marginTop: '3%' }}>
                                    <Text style={{ fontSize: 22, color: '#000' }}>
                                        Status*
                                    </Text>
                                    <Switch value={newstatus ? true : false} onValueChange={(value) => setNewStatus(value)} style={{ width: 60, height: 70 }} color='red' />
                                    {/* //  {statusError ? <Text style={styles.errorText}>{statusError}</Text> : null} */}

                                </View>

                                <TouchableOpacity
                                    onPress={() => { handleUpdateUser(), setEditModalVisible(false) }}
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
                                        Update User
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

export default Admin

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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        height: '84%',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        //alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    modalContent: {
        width: '100%',
        // padding: '4%',
        backgroundColor: '#fff',
        borderRadius: 10,
        //alignItems: 'center',
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
    errorText: {
        color: 'red',
        fontSize: 16,
        marginTop: 5,
    }
})