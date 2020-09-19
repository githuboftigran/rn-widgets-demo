import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Label = ({ text, ...restProps }) => {
  return (
    <View style={styles.root} {...restProps}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 8,
    backgroundColor: '#000',
    borderColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
  },
  text: {
    color: '#fff',
  },
});

export default memo(Label);
