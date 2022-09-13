import React from 'react';
import {TouchableWithoutFeedback, View, Text, StyleSheet} from 'react-native';

const TextButton = ({ text, containerStyle, textStyle, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={{...styles.containerStyle, ...containerStyle}}>
        <Text style={{...styles.textStyle, ...textStyle}}>{text}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TextButton;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: '#4499ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  textStyle: {
    color: '#fff',
    fontSize: 20,
  },
});
