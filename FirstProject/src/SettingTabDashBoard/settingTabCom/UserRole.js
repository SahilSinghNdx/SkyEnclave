import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';

export const UserRolePermission = ({
    checkedState,
    requestTitle,
    state,
    setState,
    isGuardAccess,
}) => {
    const handleToggle = entryKey => {
        const newState = { ...state };
        newState[entryKey] = !state[entryKey];
        setState(newState);
    };

    if (!state) return null;

    const { module, create, read, edit, delete: del, public: publicAccess } = state;

    // const isOnlyPublicAccess = !module && !create && !read && !edit && !del && publicAccess;

    // console.log("Public Accesss -> ",isOnlyPublicAccess)

    // if (isOnlyPublicAccess) {
    //     return null;
    // }
    return (
        <ScrollView contentContainerStyle={styles.headerContainer2}>
            <View style={[styles.permissionsContainer,]}>
                {checkedState == 'societylevel' && isGuardAccess == false && (
                    <>
                        <View style={{ width: '20%', alignItems: 'center', height: 60, justifyContent: 'center',marginLeft:'2%'}}>
                            <Text style={styles.titleText}>{requestTitle}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-evenly' }}>
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
                        </View>

                    </>
                )}
                {checkedState == 'guardAccess' && isGuardAccess == true && (
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <View style={{ width: '20%', alignItems: 'center', height: 60, justifyContent: 'center', marginLeft:'2%'}}>
                            <Text style={styles.titleText}>{requestTitle}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-evenly' }}>
                            <View style={styles.permissionRow}>
                                <Checkbox
                                    status={publicAccess ? 'checked' : 'unchecked'}
                                    onPress={() => handleToggle('public')}
                                />
                                <Text style={styles.moduletext}>Public Access</Text>
                            </View>
                        </View>

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
        justifyContent: 'space-between',
        flexDirection: 'row',
        elevation: 2,
    },
    titleContainer: {
        width: '40%',
        height: 85,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        marginLeft: "15%"
    },
    titleText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#000',
    },
    permissionsContainer: {
        width: '100%',
        height: 85,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    permissionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    moduletext: {
        fontSize: 17,
        color: '#000',
        fontWeight: '600',
    },
});
