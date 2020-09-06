import React from 'react';
import { View, StyleSheet } from 'react-native';
import { THUMB_RADIUS } from './Thumb';
const RAILS_HEIGHT = 4;
const Rails = () => {
  return (
    <View style={styles.root}/>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: RAILS_HEIGHT,
    borderRadius: RAILS_HEIGHT / 2,
    backgroundColor: '#7f7f7f',
    marginHorizontal: THUMB_RADIUS,
  },
});

export default Rails;
