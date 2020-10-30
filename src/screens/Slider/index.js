import React, { useCallback, useState } from 'react';
import { View } from 'react-native';

import Slider from '../../Slider';
import Thumb from '../../Slider/Thumb';
import Rail from '../../Slider/Rail';
import RailSelected from '../../Slider/RailSelected';
import Notch from '../../Slider/Notch';
import Label from '../../Slider/Label';
import TextButton from '../components/TextButton';

import styles from './styles';

const SliderScreen = () => {

  const [rangeDisabled, setRangeDisabled] = useState(false);

  const renderThumb = useCallback(() => <Thumb/>, []);
  const renderRail = useCallback(() => <Rail/>, []);
  const renderRailSelected = useCallback(() => <RailSelected/>, []);
  const renderLabel = useCallback(value => <Label text={value}/>, []);
  const renderNotch = useCallback(() => <Notch/>, []);

  const toggleRangeEnabled = useCallback(() => setRangeDisabled(!rangeDisabled), [rangeDisabled]);

  return <View style={styles.root}>
    <Slider
      style={styles.slider}
      min={0}
      max={100}
      step={1}
      disableRange={rangeDisabled}
      renderThumb={renderThumb}
      renderRail={renderRail}
      renderRailSelected={renderRailSelected}
      renderLabel={renderLabel}
      renderNotch={renderNotch}
    />
    <TextButton
      text={rangeDisabled ? 'Enable range' : 'Disable range'}
      containerStyle={styles.button}
      onPress={toggleRangeEnabled}
    />
  </View>;
};

export default SliderScreen;
