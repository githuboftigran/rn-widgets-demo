import React from 'react';
import { View, StyleSheet } from 'react-native';
const RAILS_HEIGHT = 4;
const Rails = () => {
  return (
    <View style={styles.root}>
      <View style={{width: 1, height: 20, backgroundColor: '#f00'}}/>
      <View style={{width: 1, height: 20, backgroundColor: '#f00'}}/>
      <View style={{width: 1, height: 20, backgroundColor: '#f00'}}/>
      <View style={{width: 1, height: 20, backgroundColor: '#f00'}}/>
      <View style={{width: 1, height: 20, backgroundColor: '#f00'}}/>
      <View style={{width: 1, height: 20, backgroundColor: '#f00'}}/>
      <View style={{width: 1, height: 20, backgroundColor: '#f00'}}/>
      <View style={{width: 1, height: 20, backgroundColor: '#f00'}}/>
      <View style={{width: 1, height: 20, backgroundColor: '#f00'}}/>
      <View style={{width: 1, height: 20, backgroundColor: '#f00'}}/>
      <View style={{width: 1, height: 20, backgroundColor: '#f00'}}/>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    height: RAILS_HEIGHT,
    borderRadius: RAILS_HEIGHT / 2,
    backgroundColor: '#7f7f7f',
  },
});

export default Rails;
