import React, { memo, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Animated, PanResponder, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import {useThumbFollower, useLowHigh, useWidthLayout, useLabelContainerProps} from './hooks';
import {clamp, getValueForPosition, isLowCloser} from './helpers';

const trueFunc = () => true;
const noop = () => {};

const Slider = (
  {
    style,
    min,
    max,
    step,
    low: lowProp,
    high: highProp,
    floatingLabel,
    allowLabelOverflow,
    onValueChanged,
    renderThumb,
    renderLabel,
    renderRail,
  }
) => {

  const { inPropsRef, setLow, setHigh } = useLowHigh(lowProp, highProp, min, max, step);
  const lowThumbXRef = useRef(new Animated.Value(0));
  const highThumbXRef = useRef(new Animated.Value(0));
  const { current: lowThumbX } = lowThumbXRef;
  const { current: highThumbX } = highThumbXRef;

  const gestureStateRef = useRef({ isLow: true, lastValue: 0, lastPosition: 0 });
  const [isPressed, setPressed] = useState(false);

  const containerWidthRef = useRef(0);
  const thumbWidthRef = useRef(0);

  const handleFixedLayoutsChange = useCallback(() => {
    const { current: containerWidth } = containerWidthRef;
    const { current: thumbWidth } = thumbWidthRef;
    if (!thumbWidth || !containerWidth) {
      return;
    }
    const { low, high } = inPropsRef.current;
    const { current: lowThumbX } = lowThumbXRef;
    const { current: highThumbX } = highThumbXRef;
    const lowPosition = (low - min) / (max - min) * (containerWidth - thumbWidth);
    const highPosition = (high - min) / (max - min) * (containerWidth - thumbWidth);
    lowThumbX.setValue(lowPosition);
    highThumbX.setValue(highPosition);
    onValueChanged(low, high);
  }, [inPropsRef, max, min, onValueChanged]);

  const handleContainerLayout = useWidthLayout(containerWidthRef, handleFixedLayoutsChange);
  const handleThumbLayout = useWidthLayout(thumbWidthRef, handleFixedLayoutsChange);

  const lowStyles = useMemo(() => {
    return [
      styles.lowThumbContainer,
      {transform: [{translateX: lowThumbX}]},
    ];
  }, [lowThumbX]);

  const highStyles = useMemo(() => {
    return [
      styles.highThumbContainer,
      {transform: [{translateX: highThumbX}]},
    ];
  }, [highThumbX]);

  const railStyles = useMemo(() => {
    return [styles.railsContainer, { marginHorizontal: thumbWidthRef.current / 2 }];
  }, [thumbWidthRef.current]);

  const { isLow } = gestureStateRef.current;
  const pointerX = useRef(new Animated.Value(0)).current;

  const { low, high } = inPropsRef.current;
  const labelViews = renderLabel(isLow ? low : high);
  // We assume component will always get the same number of label views.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const labelComponentsAndUpdates = labelViews.map((view, index) => useThumbFollower(containerWidthRef, gestureStateRef, view, isPressed, allowLabelOverflow, String(index)));

  const labelComponents = labelComponentsAndUpdates.map(([component]) => component);
  const labelUpdates = labelComponentsAndUpdates.map(([component, update]) => update);
  const updateLabelComponents = useCallback(position => {
    labelUpdates.forEach(update => update(position));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, labelUpdates);
  const labelContainerProps = useLabelContainerProps(floatingLabel);

  const { panHandlers } = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: trueFunc,
      onStartShouldSetPanResponderCapture: trueFunc,
      onMoveShouldSetPanResponder: trueFunc,
      onMoveShouldSetPanResponderCapture: trueFunc,
      onPanResponderTerminationRequest: trueFunc,
      onPanResponderTerminate: trueFunc,
      onShouldBlockNativeResponder: trueFunc,

      onPanResponderGrant: ({ nativeEvent }, gestureState) => {
        const { numberActiveTouches } = gestureState;
        if (numberActiveTouches > 1) {
          return;
        }
        setPressed(true);
        const { current: lowThumbX } = lowThumbXRef;
        const { current: highThumbX } = highThumbXRef;
        const { locationX: downX, pageX } = nativeEvent;
        const containerX = pageX - downX;

        const { low, high, min, max } = inPropsRef.current;
        const thumbWidth = thumbWidthRef.current;
        const containerWidth = containerWidthRef.current;

        const lowPosition = thumbWidth / 2 + (low - min) / (max - min) * (containerWidth - thumbWidth);
        const highPosition = thumbWidth / 2 + (high - min) / (max - min) * (containerWidth - thumbWidth);

        const isLow = isLowCloser(downX, lowPosition, highPosition);
        gestureStateRef.current.isLow = isLow;

        const handlePositionChange = positionInView => {
          const { low, high, min, max, step } = inPropsRef.current;
          const minValue = isLow ? min : low;
          const maxValue = isLow ? high : max;
          const value = clamp(getValueForPosition(positionInView, containerWidth, thumbWidth, min, max, step), minValue, maxValue);
          const availableSpace = containerWidth - thumbWidth;
          const absolutePosition = (value - min) / (max - min) * availableSpace;
          gestureStateRef.current.lastValue = value;
          gestureStateRef.current.lastPosition = absolutePosition + thumbWidth / 2;
          (isLow ? lowThumbX : highThumbX).setValue(absolutePosition);
          onValueChanged(isLow ? value : low, isLow ? high : value);
          (isLow ? setLow : setHigh)(value);
          updateLabelComponents(gestureStateRef.current.lastPosition);
        };
        handlePositionChange(downX);
        pointerX.removeAllListeners();
        pointerX.addListener(({ value: pointerPosition }) => {
          const positionInView = pointerPosition - containerX;
          handlePositionChange(positionInView);
        });
      },

      onPanResponderMove: Animated.event([null, { moveX: pointerX }]),

      onPanResponderRelease: () => {
        setPressed(false);
      },
    });
  }, [pointerX, inPropsRef, onValueChanged, setLow, setHigh, updateLabelComponents]);

  useEffect(() => {
    handleFixedLayoutsChange();
  }, [handleFixedLayoutsChange]);

  const lowThumb = renderThumb();
  const highThumb = renderThumb();
  const rail = renderRail();

  const rootStyles = useMemo(() => {
    return [style, styles.root];
  }, [style]);

  return (
    <View style={rootStyles}>
      <View {...labelContainerProps}>
        {labelComponents}
      </View>
      <View onLayout={handleContainerLayout} style={styles.controlsContainer}>
        <View style={railStyles}>
          {rail}
        </View>
        <Animated.View style={lowStyles} onLayout={handleThumbLayout}>
          {lowThumb}
        </Animated.View>
        <Animated.View style={highStyles}>
          {highThumb}
        </Animated.View>
        <View { ...panHandlers } style={styles.touchableArea} collapsable={false}/>
      </View>
    </View>
  );
};

Slider.propTypes = {
  ...ViewPropTypes,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  low: PropTypes.number,
  high: PropTypes.number,
  allowLabelOverflow: PropTypes.bool,
  floatingLabel: PropTypes.bool,
  renderThumb: PropTypes.func.isRequired,
  renderRail: PropTypes.func.isRequired,
  renderLabel: PropTypes.func,
  onValueChanged: PropTypes.func,
};

Slider.defaultProps = {
  allowLabelOverflow: false,
  floatingLabel: false,
  renderLabel: () => [],
  onValueChanged: noop,
};

export default memo(Slider);
