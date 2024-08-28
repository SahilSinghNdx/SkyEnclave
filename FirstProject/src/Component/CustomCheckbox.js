import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomCheckbox = ({ label, checked, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Icon
                name={checked ? 'check-box' : 'check-box-outline-blank'}
                size={24}
                color={checked ? '#007AFF' : '#8E8E93'}
            />
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    label: {
        marginLeft: 8,
        fontSize: 16,
    },
});

export default CustomCheckbox;
