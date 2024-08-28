import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';

const MyButton = ({ text, onPress, title, image, nameT, currentLanguage }) => {
  const [firstWord, setFirstWord] = useState('');

  useEffect(() => {
    setFirstWord(extractFirstText(nameT));
  }, [nameT, currentLanguage]);

  const extractFirstText = (nameT) => {
    if (!nameT) return ''; // Check if nameT is defined
    const words = nameT.split('');
    if (words.length > 0) {
      return words[0];
    }
    return '';
  };

  const truncateText = (text, wordLimit) => {
    if (!text) return ''; // Check if text is defined
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  const getFirstWord = () => {
    if (!nameT) return ''; // Check if nameT is defined
    if (currentLanguage === 'hindi') {
      return extractFirstText(nameT);
    }
    return extractFirstText(nameT); // By default, it will return the first word of nameT
  };

  let content;
  if (image) {
    content = <Image source={image} style={{ width: 50, height: 50 }} />;
  } else if (nameT) {
    content = (
      <View style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 40, borderWidth: 2 }}>
        <Text style={{ fontSize: 35, color: '#000', fontWeight: '600' }}>{getFirstWord()}</Text>
      </View>
    );
  } else {
    content = (
      <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: 'grey' }}>
        <Text style={{ fontSize:25, color: '#fff' }}>{getInitials(title)}</Text>
      </View>
    );
  }

  return (
    <View style={{  marginHorizontal: 20 }}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          marginBottom: 30,
          backgroundColor: '#F2F1F1',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 20,
          elevation: 4, width: 150, height: 150,
        }}>
        {content}
        {title && (
          <Text style={{ fontSize:17, fontWeight: '500',width:120, color: 'black', textAlign: 'center',marginTop:10 }} numberOfLines={1}>
            {title}
          </Text>
        )}
        <Text
          style={{
            fontSize: 30,
            fontWeight: '700',
            color: 'black',
            marginTop: '6%',
            //backgroundColor: 'red'
          }}>
          {truncateText(text, 1)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const getInitials = (title) => {
  if (!title) return '';
  const words = title.split(' ');
  const initials = words.map(word => word[0]).join('');
  return initials;
};

export default MyButton;

const styles = StyleSheet.create({});
