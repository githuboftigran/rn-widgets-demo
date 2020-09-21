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
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  text: {
    color: '#000',
  },
});

export default memo(Label);
