import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import axios, { Axios } from 'axios';
import { Checkbox, RadioButton } from 'react-native-paper';
import { RenderRolePermissions } from './settingTabCom/RenderRole';
import { DELETE_ROLE, GET_ROLE, POST_ROLE } from '../Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRolePermission } from './settingTabCom/UserRole';

const Role = ({ route, navigation }) => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [EditmodalVisible, setEditModalVisible] = useState(false);

  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const [checked, setChecked] = useState('');
  const [errorEntryType, setErrorEntryType] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [titleEnglishUpdate, setTitleEnglishUpdate] = useState('');
  const [descriptionUpdate, setDescriptionUpdate] = useState('');
  const [roleTypeLevelSociety, setRoleTypeLevelSociety] = useState('societylevel');
  const [selectedItem, setSelectedItem] = useState();
  const [permissions, setPermissions] = useState([]);

  const [regularEntriesState, setRegularEntriesState] = useState({
    module: false,
    create: false,
    read: false,
    edit: false,
    delete: false,
  });
  // console.log(regularEntriesState, '111111111111111111111111111111')
  const [guestEntriesState, setGuestEntriesState] = useState({
    module: false,
    create: false,
    read: false,
    edit: false,
    delete: false,
  });

  const [typesOfEntriesState, setTypesOfEntriesState] = useState({
    module: false,
    create: false,
    read: false,
    edit: false,
    delete: false,
  });

  const [purposeofOcassional, setpurposeofOcassionalState] = useState({
    module: false,
    create: false,
    read: false,
    edit: false,
    delete: false,
  });

  const [houseList, setHouseListState] = useState({
    module: false,
    create: false,
    read: false,
    edit: false,
    delete: false,
  });

  const [roles, setRoleState] = useState({
    module: false,
    create: false,
    read: false,
    edit: false,
    delete: false,
  });

  const [Adminuser, setAdminUserState] = useState({
    module: false,
    create: false,
    read: false,
    edit: false,
    delete: false,
  });

  const [publicAccess, setPublicAccessState] = useState({
    public: false,
  });

  const [newregularEntriesState, setNewRegularEntriesState] = useState({
    module: selectedItem?.permissions[0]?.actions.includes('module') || false,
    create: selectedItem?.permissions[0]?.actions.includes('create') || false,
    read: selectedItem?.permissions[0]?.actions.includes('read') || false,
    edit: selectedItem?.permissions[0]?.actions.includes('edit') || false,
    delete: selectedItem?.permissions[0]?.actions.includes('delete') || false,
  });
  // console.log(newregularEntriesState, 'me hu dinr how are you')
  const [newguestEntriesState, setNewGuestEntriesState] = useState({
    module: false,
    create: false,
    read: false,
    edit: false,
    delete: false,
  });

  const [newtypesOfEntriesState, setNewTypesOfEntriesState] = useState({
    module: false,
    create: false,
    read: false,
    edit: false,
    delete: false,
  });

  const [newpurposeofOcassional, setNewpurposeofOcassionalState] = useState({
    module: false,
    create: false,
    read: false,
    edit: false,
    delete: false,
  });

  const [newhouseList, setNewHouseListState] = useState({
    module: false,
    create: false,
    read: false,
    edit: false,
    delete: false,
  });

  const [newroles, setNewRoleState] = useState({
    module: false,
    create: false,
    read: false,
    edit: false,
    delete: false,
  });

  const [newAdminuser, setNewAdminUserState] = useState({
    module: false,
    create: false,
    read: false,
    edit: false,
    delete: false,
  });

  const [newpublicAccess, setNewPublicAccessState] = useState({
    public: false
  });

  useEffect(() => {
    if (selectedItem) {
      setNewRegularEntriesState({
        module: selectedItem.permissions[0]?.actions.includes('module') || false,
        create: selectedItem.permissions[0]?.actions.includes('create') || false,
        read: selectedItem.permissions[0]?.actions.includes('read') || false,
        edit: selectedItem.permissions[0]?.actions.includes('edit') || false,
        delete: selectedItem.permissions[0]?.actions.includes('delete') || false,
      });
      setNewGuestEntriesState({
        module: selectedItem.permissions[1]?.actions.includes('module') || false,
        create: selectedItem.permissions[1]?.actions.includes('create') || false,
        read: selectedItem.permissions[1]?.actions.includes('read') || false,
        edit: selectedItem.permissions[1]?.actions.includes('edit') || false,
        delete: selectedItem.permissions[1]?.actions.includes('delete') || false,
      });
      setNewTypesOfEntriesState({
        module: selectedItem.permissions[2]?.actions.includes('module') || false,
        create: selectedItem.permissions[2]?.actions.includes('create') || false,
        read: selectedItem.permissions[2]?.actions.includes('read') || false,
        edit: selectedItem.permissions[2]?.actions.includes('edit') || false,
        delete: selectedItem.permissions[2]?.actions.includes('delete') || false,
      });
      setNewpurposeofOcassionalState({
        module: selectedItem.permissions[3]?.actions.includes('module') || false,
        create: selectedItem.permissions[3]?.actions.includes('create') || false,
        read: selectedItem.permissions[3]?.actions.includes('read') || false,
        edit: selectedItem.permissions[3]?.actions.includes('edit') || false,
        delete: selectedItem.permissions[3]?.actions.includes('delete') || false,
      });
      setNewHouseListState({
        module: selectedItem.permissions[4]?.actions.includes('module') || false,
        create: selectedItem.permissions[4]?.actions.includes('create') || false,
        read: selectedItem.permissions[4]?.actions.includes('read') || false,
        edit: selectedItem.permissions[4]?.actions.includes('edit') || false,
        delete: selectedItem.permissions[4]?.actions.includes('delete') || false,
      });
      setNewRoleState({
        module: selectedItem.permissions[5]?.actions.includes('module') || false,
        create: selectedItem.permissions[5]?.actions.includes('create') || false,
        read: selectedItem.permissions[5]?.actions.includes('read') || false,
        edit: selectedItem.permissions[5]?.actions.includes('edit') || false,
        delete: selectedItem.permissions[5]?.actions.includes('delete') || false,
      });
      setNewAdminUserState({
        module: selectedItem.permissions[6]?.actions.includes('module') || false,
        create: selectedItem.permissions[6]?.actions.includes('create') || false,
        read: selectedItem.permissions[6]?.actions.includes('read') || false,
        edit: selectedItem.permissions[6]?.actions.includes('edit') || false,
        delete: selectedItem.permissions[6]?.actions.includes('delete') || false,
      });
      setNewPublicAccessState({
        public: selectedItem.permissions[0]?.actions.includes('public') || false,
      })
    }
  }, [selectedItem]);

  const fetchData = async () => {
    try {
      // Retrieve the user ID from AsyncStorage
      const storedUserID = await AsyncStorage.getItem('userID');

      if (storedUserID) {
        // console.log('Stored User ID:', storedUserID);

        // Fetch roles data from the API
        const response = await axios.get(GET_ROLE);

        if (response.data.success) {
          // Filter roles based on the createdBy field matching the stored userID
          const filteredRoles = response.data.roles.filter(role => role.createdBy === storedUserID);

          // Update state with the filtered roles data
          setData(filteredRoles);
          setFilteredData(filteredRoles);
          // console.log('Filtered Roles Data:', filteredRoles);
        } else {
          //console.error('No roles data found in response');
        }
      } else {
        //console.error('No user ID found in AsyncStorage');
      }
    } catch (error) {
      // console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleSearch = text => {
    setSearchQuery(text);
    const filtered = data.filter(
      item =>
        item.title && item.title.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  const NoData = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '10%',
        }}>
        <Text style={{ color: 'black', fontSize: 33 }}>No Data Found</Text>
      </View>
    );
  };

  const validateFields = () => {
    let isValid = true;

    if (!title) {
      setTitleError('Please fill Title.');
      isValid = false;
    } else {
      setTitleError(''); // Clear error when title is filled
    }

    if (!description) {
      setDescriptionError('Please fill Description.');
      isValid = false;
    } else {
      setDescriptionError(''); // Clear error when description is filled
    }

    return isValid;
  };

  const handleAddNewEntries = async () => {
    if (validateFields()) {
      const newEntry = {
        title: title, // Replace with dynamic data if needed
        desc: description,
        roleTypeLevelSociety: checked,
        permissions: preparePermissions(), // Ensure this matches the API's expectations
      };

      try {
        const societyID = await AsyncStorage.getItem('userID');
        if (societyID) {
          // console.log('Society ID:', societyID);
          newEntry.createdBy = societyID; // Add the retrieved societyID to newEntry
        } else {
          // console.error('No society ID found in AsyncStorage');
        }
      } catch (error) {
        //console.error('Error retrieving society ID from AsyncStorage:', error);
      }

      try {
        const response = await axios.post(
          'https://app.guardx.cloud/api/roleCreate',
          newEntry,
        );
        if (response.data.success) {
          // Handle successful response
          Alert.alert('Success', 'Role created successfully!');
          //  console.log('Role created successfully:', response.data);
          // Update state or perform other actions as needed

          resetFormData();
          setChecked('');
          setModalVisible(false);

          // Update UI - refresh list or re-fetch data
          fetchData();
        } else {
          // Handle unsuccessful response
          Alert.alert('Error', response.data.msg || 'Failed to create role');
          //console.error('Failed to create role:', response.data);
        }
      } catch (error) {
        // Handle error during the POST request
        Alert.alert('Error', 'An error occurred while creating the role');
        // console.error('Error posting data:', error.message);
      }
    } else {
      // Handle validation failure
      Alert.alert('Validation Error', 'Please check the input fields');
    }
  };

  const handleItemClick = (item) => {
    // console.log("What is inside this item? --> ", item);
    setSelectedItem(item)
    // console.log('Permissions im geting ---> ', selectedItem);
    console.log('Permissions im geting ---> ', item?.permissions[0]?.actions.includes('public'))

    setEditModalVisible(true);
    setTitleEnglishUpdate(item?.title);
    setDescriptionUpdate(item?.desc);
    setRoleTypeLevelSociety(item?.roleTypeLevelSociety);
    console.log(roleTypeLevelSociety)
    setPermissions(item?.permissions);
  };
  const openModal = () => setModalVisible(true);
  const closeModal = () => {
    resetFormData();
    setModalVisible(false);
  };

  const handleEntryTypeSelection = value => {
    setChecked(value);
    if (value) {
      setErrorEntryType('');
    }
  };

  const preparePermissions = () => {
    let permissions = [];

    if (checked === 'societylevel') {
      permissions = [
        {
          moduleName: 'Regular Entries',
          actions: Object.keys(regularEntriesState).filter(
            key => regularEntriesState[key],
          ),
        },
        {
          moduleName: 'Guest Entries Request',
          actions: Object.keys(guestEntriesState).filter(
            key => guestEntriesState[key],
          ),
        },
        {
          moduleName: 'Types of Entries',
          actions: Object.keys(typesOfEntriesState).filter(
            key => typesOfEntriesState[key],
          ),
        },
        {
          moduleName: 'Purpose of Occasional',
          actions: Object.keys(purposeofOcassional).filter(
            key => purposeofOcassional[key],
          ),
        },
        {
          moduleName: 'House List',
          actions: Object.keys(houseList).filter(key => houseList[key]),
        },
        {
          moduleName: 'Roles',
          actions: Object.keys(roles).filter(key => roles[key]),
        },
        {
          moduleName: 'Admin User',
          actions: Object.keys(Adminuser).filter(key => Adminuser[key]),
        },
      ];
    } else if (checked === 'guardAccess') {
      permissions = [
        {
          moduleName: 'Public Access',
          actions: Object.keys(publicAccess).filter(key => publicAccess[key]),
        },
      ];
    }

    return permissions;
  };

  const toggleModel = () => setEditModalVisible(!EditmodalVisible);

  const resetFormData = () => {
    setTitle('');
    setDescription('');
    setChecked(''); // Reset radio button selection
    setRegularEntriesState({
      module: false,
      create: false,
      read: false,
      edit: false,
      delete: false,
    });
    setGuestEntriesState({
      module: false,
      create: false,
      read: false,
      edit: false,
      delete: false,
    });
    setTypesOfEntriesState({
      module: false,
      create: false,
      read: false,
      edit: false,
      delete: false,
    });
    setpurposeofOcassionalState({
      module: false,
      create: false,
      read: false,
      edit: false,
      delete: false,
    });
    setHouseListState({
      module: false,
      create: false,
      read: false,
      edit: false,
      delete: false,
    });
    setRoleState({
      module: false,
      create: false,
      read: false,
      edit: false,
      delete: false,
    });
    setAdminUserState({
      module: false,
      create: false,
      read: false,
      edit: false,
      delete: false,
    });
    setPublicAccessState({
      module: false,
      create: false,
      read: false,
      edit: false,
      delete: false,
    });
  };

  const handleDeleteEntry = async (delete_id) => {
    //  console.log(delete_id, '------------------>');
    try {
      const response = await axios.delete(`${DELETE_ROLE}/${delete_id}`);
      if (response.data.msg) {
        //console.log('successfully Added:', response.data.msg);
        fetchData();
      } else {
        //    console.error('Delete operation failed:', response.data.msg);
      }
    } catch (error) {
      //  console.error('Error deleting data:', error);
    }
  };

  const handleEditTypeSelection = value => {
    setRoleTypeLevelSociety(value); // Update roleTypeLevelSociety state based on radio button selection
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
        <Text style={styles.headingtxt}>List of Role</Text>
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
              style={styles.printImage}
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
            <Text style={styles.headerText}>Title</Text>
          </View>
          <View style={{ width: '13%' }}>
            <Text style={styles.headerText}>Description</Text>
          </View>
          <View style={{ width: '13%' }}>
            <Text style={styles.headerText}>Action</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={filteredData}
        ListEmptyComponent={NoData}
        renderItem={({ item, index }) => {
          // console.log('-------------------->', item)
          return (
            <View style={styles.itemContainer}>
              <View style={{ width: 190 }}>
                <Text style={[styles.itemText, { marginLeft: 5 }]}>
                  {item.title}
                </Text>
              </View>

              <View style={{ width: 100 }}>
                <Text style={[styles.itemText, {}]}>{item.desc}</Text>
              </View>

              <View style={[styles.itemCenter, { alignItems: 'center' }]}>
                <TouchableOpacity onPress={() => handleItemClick(item)}>
                  <Image
                    source={require('../../assets/Image/Edit1.png')}
                    style={[styles.deleteIcon, { marginRight: 50 }]}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDeleteEntry(item._id)}>
                  <Image
                    source={require('../../assets/Image/delete1.png')}
                    style={[styles.deleteIcon, { marginRight: 40 }]}
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
        onRequestClose={closeModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={[styles.header1, {}]}>
              <TouchableOpacity onPress={closeModal} style={styles.backButton}>
                <Image
                  source={require('../../assets/Image/back.png')}
                  style={styles.backImage}
                />
              </TouchableOpacity>
              <Text style={styles.modalText}>Add New Role</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: '5%',
                alignItems: 'center',
                alignSelf: 'center',
                width: '94%',
              }}>
              <View style={{ width: '30%' }}>
                <Text style={{ fontSize: 19, color: '#000', marginLeft: 10 }}>
                  Title*
                </Text>
                <TextInput
                  placeholder="Title"
                  style={styles.input}
                  value={title}
                  onChangeText={text => setTitle(text)}
                />
                {titleError ? (
                  <Text style={styles.errorText}>{titleError}</Text>
                ) : null}
              </View>
              <View style={{ width: '30%', marginRight: 30 }}>
                <Text style={{ fontSize: 19, color: '#000', marginLeft: 10 }}>
                  Description*
                </Text>

                <TextInput
                  placeholder="Description"
                  style={styles.input}
                  value={description}
                  onChangeText={text => setDescription(text)}
                />
                {descriptionError ? (
                  <Text style={styles.errorText}>{descriptionError}</Text>
                ) : null}
              </View>

              <View style={{ width: '30%', marginRight: 30 }}>
                <Text
                  style={{
                    fontSize: 19,
                    color: '#000',
                    marginLeft: 10,
                    marginTop: -10,
                  }}>
                  Role Type*
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginRight: 20,
                    }}>
                    <RadioButton
                      value="societylevel"
                      status={
                        checked === 'societylevel' ? 'checked' : 'unchecked'
                      }
                      onPress={() => handleEntryTypeSelection('societylevel')}
                    />
                    <Text style={{ fontSize: 16, color: 'black' }}>
                      Society level Role
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RadioButton
                      value="guardAccess"
                      status={
                        checked === 'guardAccess' ? 'checked' : 'unchecked'
                      }
                      onPress={() => handleEntryTypeSelection('guardAccess')}
                    />
                    <Text style={{ fontSize: 16, color: 'black' }}>
                      Guard Access
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <ScrollView>
              <View style={styles.headerContainer1}>
                <View
                  style={{
                    width: '30%',
                    height: 85,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{ fontSize: 22, fontWeight: '600' }}>
                    Module Name
                  </Text>
                </View>
                <View
                  style={{
                    width: '70%',
                    height: 85,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{ fontSize: 22, fontWeight: '600' }}>
                    Module Actions
                  </Text>
                </View>
              </View>
              <View>
                {checked == 'societylevel' && (
                  <>
                    <RenderRolePermissions
                      checkedState={checked}
                      requestTitle="Regular Entries"
                      state={regularEntriesState}
                      setState={setRegularEntriesState}
                    />
                    <RenderRolePermissions
                      checkedState={checked}
                      requestTitle="Guest Entries"
                      state={guestEntriesState}
                      setState={setGuestEntriesState}
                    />
                    <RenderRolePermissions
                      checkedState={checked}
                      requestTitle="Types of Entries"
                      state={typesOfEntriesState}
                      setState={setTypesOfEntriesState}
                    />
                    <RenderRolePermissions
                      checkedState={checked}
                      requestTitle="Purpose of Occasional"
                      state={purposeofOcassional}
                      setState={setpurposeofOcassionalState}
                    />
                    <RenderRolePermissions
                      checkedState={checked}
                      requestTitle="House List"
                      state={houseList}
                      setState={setHouseListState}
                    />
                    <RenderRolePermissions
                      checkedState={checked}
                      requestTitle="Roles"
                      state={roles}
                      setState={setRoleState}
                    />
                    <RenderRolePermissions
                      checkedState={checked}
                      requestTitle="Admin User"
                      state={Adminuser}
                      setState={setAdminUserState}
                    />
                  </>
                )}

                {checked == 'guardAccess' && (
                  <RenderRolePermissions
                    checkedState={checked}
                    requestTitle="Public Access"
                    state={publicAccess}
                    setState={setPublicAccessState}
                  />
                )}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.headerContainer2}
              onPress={handleAddNewEntries}>
              <Text style={styles.moduletext}>Create Role</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={EditmodalVisible}
        onRequestClose={() => toggleModel()}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={[styles.header1, {}]}>
              <TouchableOpacity
                onPress={() => toggleModel()}
                style={styles.backButton}>
                <Image
                  source={require('../../assets/Image/back.png')}
                  style={styles.backImage}
                />
              </TouchableOpacity>
              <Text style={styles.modalText}>Edit Role</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: '5%',
                alignItems: 'center',
                alignSelf: 'center',
                width: '94%',
              }}>
              <View style={{ width: '30%' }}>
                <Text style={{ fontSize: 19, color: '#000', marginLeft: 10 }}>
                  Title*
                </Text>
                <TextInput
                  placeholder="Title"
                  style={styles.input}
                  value={titleEnglishUpdate}
                  onChangeText={text => setTitleEnglishUpdate(text)}
                />
                {titleError ? (
                  <Text style={styles.errorText}>{titleError}</Text>
                ) : null}
              </View>
              <View style={{ width: '30%', marginRight: 30 }}>
                <Text style={{ fontSize: 19, color: '#000', marginLeft: 10 }}>
                  Description*
                </Text>

                <TextInput
                  placeholder="Description"
                  style={styles.input}
                  value={descriptionUpdate}
                  onChangeText={text => setDescriptionUpdate(text)}
                />
                {descriptionError ? (
                  <Text style={styles.errorText}>{descriptionError}</Text>
                ) : null}
              </View>

              <View style={{ width: '30%', marginRight: 30 }}>
                <Text
                  style={{
                    fontSize: 19,
                    color: '#000',
                    marginLeft: 10,
                    marginTop: -10,
                  }}>
                  Role Type*
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginRight: 20,
                    }}>
                    <RadioButton
                      value="societylevel"
                      status={
                        roleTypeLevelSociety === 'societylevel'
                          ? 'checked'
                          : 'unchecked'
                      }
                      onPress={() => handleEditTypeSelection('societylevel')}
                    />
                    <Text style={{ fontSize: 16, color: 'black' }}>
                      Socitey level Role
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RadioButton
                      value="guardAccess"
                      status={
                        roleTypeLevelSociety === 'guardAccess'
                          ? 'checked'
                          : 'unchecked'
                      }
                      onPress={() => handleEditTypeSelection('guardAccess')}
                    />
                    <Text style={{ fontSize: 16, color: 'black' }}>
                      Guard Access
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <ScrollView>
              <View style={styles.headerContainer1}>
                <View style={styles.titleContainer}>
                  <Text style={styles.itemText}>Module Name</Text>
                </View>
                <View style={styles.permissionsContainer}>
                  <Text style={styles.itemText}>Module Actions</Text>
                </View>
              </View>
              <View style={{}}>
                {roleTypeLevelSociety == 'societylevel' ?
                  <>
                    <UserRolePermission
                      isGuardAccess={false}
                      checkedState={roleTypeLevelSociety ?? 'societylevel'}
                      requestTitle="Regular Entries"
                      state={newregularEntriesState}
                      setState={setNewRegularEntriesState}
                    />
                    <UserRolePermission
                      isGuardAccess={false}
                      checkedState={roleTypeLevelSociety ?? 'societylevel'}
                      requestTitle="Guest Entries"
                      state={newguestEntriesState}
                      setState={setGuestEntriesState}
                    />
                    <UserRolePermission
                      isGuardAccess={false}
                      checkedState={roleTypeLevelSociety ?? 'societylevel'}
                      requestTitle="Types of Entries"
                      state={newtypesOfEntriesState}
                      setState={setTypesOfEntriesState}
                    />
                    <UserRolePermission
                      isGuardAccess={false}
                      checkedState={roleTypeLevelSociety ?? 'societylevel'}
                      requestTitle="Purpose of Occasional"
                      state={newpurposeofOcassional}
                      setState={setNewpurposeofOcassionalState}
                    />
                    <UserRolePermission
                      isGuardAccess={false}
                      checkedState={roleTypeLevelSociety ?? 'societylevel'}
                      requestTitle="House List"
                      state={newhouseList}
                      setState={setNewHouseListState}
                    />
                    <UserRolePermission
                      isGuardAccess={false}
                      checkedState={roleTypeLevelSociety ?? 'societylevel'
                      }
                      requestTitle="Roles"
                      state={newroles}
                      setState={setNewRoleState}
                    />
                    <UserRolePermission
                      isGuardAccess={false}
                      checkedState={roleTypeLevelSociety ?? 'societylevel'
                      }
                      requestTitle="Admin User"
                      state={newAdminuser}
                      setState={setNewAdminUserState}
                    />
                  </> : < UserRolePermission
                    isGuardAccess={true}
                    checkedState={roleTypeLevelSociety ?? 'guardAccess'}
                    requestTitle={'Public Access'}
                    state={newpublicAccess}
                    setState={setNewPublicAccessState}
                  />}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.headerContainer2}
              onPress={handleAddNewEntries}>
              <Text style={styles.moduletext}>Create Role</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
    //  backgroundColor: 'red',
    width: '100%',
    alignItems: 'center',
    // marginTop: 30
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
    fontWeight: '500',
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
    // justifyContent: "center",
    //alignItems: "center",
    // marginTop: 22
  },
  modalView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    //alignItems: "center",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000'
  },
  input: {
    height: 40,
    width: '100%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    fontSize: 19,
    color: '#000',
  },
  header1: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '60%',
    //backgroundColor: 'red'
  },
  headerContainer: {
    width: '92%',
    height: 90,
    backgroundColor: '#FA8D8D',
    borderRadius: 10,
    marginTop: '5%',
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerContainer1: {
    width: '92%',
    height: 90,
    backgroundColor: '#FA8D8D',
    borderRadius: 10,
    marginTop: '6%',
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerContainer2: {
    width: '32%',
    height: 55,
    backgroundColor: '#FA8D8D',
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduletext: {
    fontSize: 18,
    color: '#000',
    fontWeight: '400',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    // marginTop: 2,
    marginLeft: 20,
  },
  titleContainer: {
    width: '30%',
    height: 85,
    justifyContent: 'center',
    alignItems: 'center',
    //  backgroundColor: '#fff'
  },
  permissionsContainer: {
    width: '66%',
    height: 85,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // backgroundColor: 'red'
  },
});

export default Role;
