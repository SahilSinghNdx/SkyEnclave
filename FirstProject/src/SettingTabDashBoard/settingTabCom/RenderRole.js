import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';

export const RenderRolePermissions = ({
  checkedState,
  requestTitle,
  state,
  setState,
}) => {
  console.log('The name of the state --> ', state);
  const handleToggle = entryKey => {
    const newState = { ...state };
    newState[entryKey] = !state[entryKey];
    setState(newState);
  };

  if (!state) return null;

  const { module, create, read, edit, delete: del, public: publicAccess } = state;
  // console.log('The name of the module --> ', publicAccess);
  // console.log(checkedState == 'guardAccess')

  return (
    <ScrollView contentContainerStyle={styles.headerContainer2}>

      <View style={styles.permissionsContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{requestTitle}</Text>
        </View>
        {checkedState == 'societylevel' && (
          <>
            <View style={styles.permissionRow}>
              <Checkbox
                status={module ? 'checked' : 'unchecked'}
                onPress={() => handleToggle('module')}
              />
              <Text style={styles.moduletext}>Module</Text>
            </View>
            <View style={styles.permissionRow}>
              <Checkbox
                status={create ? 'checked' : 'unchecked'}
                onPress={() => handleToggle('create')}
              />
              <Text style={styles.moduletext}>Create</Text>
            </View>
            <View style={styles.permissionRow}>
              <Checkbox
                status={read ? 'checked' : 'unchecked'}
                onPress={() => handleToggle('read')}
              />
              <Text style={styles.moduletext}>Read</Text>
            </View>
            <View style={styles.permissionRow}>
              <Checkbox
                status={edit ? 'checked' : 'unchecked'}
                onPress={() => handleToggle('edit')}
              />
              <Text style={styles.moduletext}>Edit</Text>
            </View>
            <View style={styles.permissionRow}>
              <Checkbox
                status={del ? 'checked' : 'unchecked'}
                onPress={() => handleToggle('delete')}
              />
              <Text style={styles.moduletext}>Delete</Text>
            </View>
          </>
        )}
        {checkedState == 'guardAccess' && (
          
            <View style={styles.permissionRow}>
              <Checkbox
                status={publicAccess ? 'checked' : 'unchecked'}
                onPress={() => handleToggle('public')}
              />
              <Text style={styles.moduletext}>Public Access</Text>
            </View>
        
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer2: {
    width: '92%',
    height: 90,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 2,
  },
  titleContainer: {
    width: '30%',
    height: 85,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  titleText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
  },
  permissionsContainer: {
    width: '70%',
    height: 85,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    //backgroundColor: 'red',
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '17%',
  },
  moduletext: {
    fontSize: 17,
    color: '#000',
    fontWeight: '600',
  },
});
