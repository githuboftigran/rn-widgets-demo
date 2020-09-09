import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Animated, PanResponder, View } from 'react-native';
import styles from './styles';
import Rails from './Rails';
import Thumb from './Thumb';
import Label from './Label';
import {useLabelBounds, useLowHigh, useWidthLayout} from './hooks';
import { getInOutRanges, isLowCloser } from './helpers';

const trueFunc = () => true;

const Slider = ({ style, min, max, step, low: lowProp, high: highProp, onValueChanged }) => {
  const [thumbWidth, setThumbWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const { low, high, setLow, setHigh } = useLowHigh(lowProp, highProp, min, max);

  const [lowThumbX, setLowThumbX] = useState(new Animated.Value(0));
  const [highThumbX, setHighThumbX] = useState(new Animated.Value(0));

  const pointerX = useRef(new Animated.Value(0)).current;
  const inPropsRef = useRef({ low, high, min, max, step });
  const gestureStateRef = useRef({
    isLow: true,
    lastTouch: Number.NaN,
    touchPointer: undefined,
  });
  const { isLow } = gestureStateRef.current;
  // Always update values of refs so oan responder will have updated values
  Object.assign(inPropsRef.current, { low, high, min, max, step });

  const lowTransform = !lowThumbX ? null : { transform: [{translateX: lowThumbX}]};
  const highTransform = !highThumbX ? null : { transform: [{translateX: highThumbX}]};

  const { handleLabelLayout, labelTransform } = useLabelBounds(thumbWidth, isLow ? lowThumbX : highThumbX);

  const handleContainerLayout = useWidthLayout(setContainerWidth);
  const handleThumbLayout = useWidthLayout(setThumbWidth);

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
        const { locationX: downX, pageX } = nativeEvent;
        const containerX = pageX - downX;

        const { low, high, min, max, step } = inPropsRef.current;

        const lowPosition = thumbWidth / 2 + (low - min) / (max - min) * (containerWidth - thumbWidth);
        const highPosition = thumbWidth / 2 + (high - min) / (max - min) * (containerWidth - thumbWidth);

        const allSteps = Math.round((max - min) / step);
        const isLow = isLowCloser(downX, lowPosition, highPosition);
        gestureStateRef.current.isLow = isLow;
        const { inputRange, outputRange } = getInOutRanges(lowPosition, highPosition, isLow, allSteps, containerWidth, thumbWidth);
        const valueSetter = isLow ? setLow : setHigh;
        const thumbXSetter = isLow ? setLowThumbX : setHighThumbX;

        pointerX.removeAllListeners();
        const animatedX = Animated.subtract(pointerX, containerX).interpolate({ inputRange, outputRange, extrapolate: 'clamp' });
        animatedX.addListener((() => {
          // Set value with setter hook only if it's changed to avoid unnecessary re-renders.
          let lastValue = Number.NaN;
          return ({ value }) => {
            const numberValue = min + (max - min) * value / (containerWidth - thumbWidth);
            if (numberValue !== lastValue) {
              lastValue = numberValue;
              valueSetter(lastValue);
              if (onValueChanged) {
                onValueChanged(isLow ? lastValue : low, isLow ? high : lastValue);
              }
            }
          };
        })());
        thumbXSetter(animatedX);
        pointerX.setValue(pageX);
      },

      onPanResponderMove: Animated.event([null, { moveX: pointerX }]),

      onPanResponderRelease: ({ nativeEvent }) => {
        const { locationX } = nativeEvent;
        const { isLow } = gestureStateRef.current;
        const thumbXSetter = isLow ? setLowThumbX : setHighThumbX;
        thumbXSetter(new Animated.Value(locationX));
      },
    });
  }, [pointerX, thumbWidth, containerWidth, setLow, setHigh, onValueChanged]);

  useEffect(() => {
    if (!thumbWidth || !containerWidth) {
      return;
    }
    const lowPosition = (low - min) / (max - min) * (containerWidth - thumbWidth);
    const highPosition = (high - min) / (max - min) * (containerWidth - thumbWidth);
    if (lowThumbX.setValue) {
      lowThumbX.setValue(lowPosition);
    }
    if (highThumbX.setValue) {
      highThumbX.setValue(highPosition);
    }
  }, [min, max, low, high, lowThumbX, highThumbX, thumbWidth, containerWidth]);

  return (
    <View
      style={[style, styles.root]}
      onLayout={handleContainerLayout}
    >
      <View style={styles.railsContainer}>
        <Rails/>
      </View>
      <Animated.View
        style={[styles.lowThumbContainer, lowTransform]}
        onLayout={handleThumbLayout}
      >
        <Thumb/>
      </Animated.View>
      <Animated.View
        style={[styles.highThumbContainer, highTransform]}
      >
        <Thumb/>
      </Animated.View>
      <Animated.View
        style={{...styles.labelContainer, ...labelTransform}}

      >
        <Label
          text={`Value: ${Math.round(isLow ? low : high)}`}
          onLayout={handleLabelLayout}
        />
      </Animated.View>
      <View { ...panHandlers } style={styles.touchableArea} collapsable={false}/>
    </View>
  );
};

export default Slider;
