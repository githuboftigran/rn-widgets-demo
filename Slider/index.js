import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {Animated, PanResponder, View} from 'react-native';
import styles from './styles';
import Rails from './Rails';
import Thumb from './Thumb';
import { getInOutRanges, isLowCloser } from './helpers';

const trueFunc = () => true;

const Slider = ({ style, min, max, step }) => {
  const [thumbWidth, setThumbWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(100);

  const [lowThumbX, setLowThumbX] = useState();
  const [highThumbX, setHighThumbX] = useState();

  const lowTransform = !lowThumbX ? null : { transform: [{translateX: lowThumbX}]};
  const highTransform = !highThumbX ? null : { transform: [{translateX: highThumbX}]};
  const handleContainerLayout = useCallback(({ nativeEvent }) => {
    const { layout: {width}} = nativeEvent;
    setContainerWidth(width);
  }, []);

  const handleThumbLayout = useCallback(({ nativeEvent }) => {
    const { layout: {width}} = nativeEvent;
    setThumbWidth(width);
  }, []);

  const pointerX = useRef(new Animated.Value(0)).current;

  const lowRef = useRef();
  const highRef = useRef();
  const minRef = useRef();
  const maxRef = useRef();

  // Always update values of refs so oan responder will have updated values
  lowRef.current = low;
  highRef.current = high;
  minRef.current = min;
  maxRef.current = max;

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

        const low = lowRef.current;
        const high = highRef.current;
        const min = minRef.current;
        const max = maxRef.current;

        const lowPosition = thumbWidth / 2 + (low - min) / (max - min) * (containerWidth - thumbWidth);
        const highPosition = thumbWidth / 2 + (high - min) / (max - min) * (containerWidth - thumbWidth);

        const allSteps = Math.round((max - min) / step);
        const isLow = isLowCloser(downX, lowPosition, highPosition);
        const { inputRange, outputRange } = getInOutRanges(lowPosition, highPosition, isLow, allSteps, containerWidth, thumbWidth);
        const valueSetter = isLow ? setLow : setHigh;
        const thumbXSetter = isLow ? setLowThumbX : setHighThumbX;

        pointerX.removeAllListeners();
        const animatedX = Animated.subtract(pointerX, containerX).interpolate({ inputRange, outputRange, extrapolate: 'clamp' });
        animatedX.addListener((() => {
          let lastValue = Number.NaN;
          return ({ value }) => {
            const numberValue = min + (max - min) * value / (containerWidth - thumbWidth);
            if (numberValue !== lastValue) {
              lastValue = numberValue;
              valueSetter(lastValue);
            }
          };
        })());
        thumbXSetter(animatedX);
        pointerX.setValue(pageX);
      },

      onPanResponderMove: Animated.event([null, { moveX: pointerX }]),

      onPanResponderRelease: () => {
        setLowThumbX();
        setHighThumbX();
      },
    });
  }, [containerWidth, pointerX, setHigh, setLow, step, thumbWidth]);

  useEffect(() => {
    if (!thumbWidth || !containerWidth) {
      return;
    }
    const lowPosition = (low - min) / (max - min) * (containerWidth - thumbWidth);
    const highPosition = (high - min) / (max - min) * (containerWidth - thumbWidth);
    if (!lowThumbX) {
      setLowThumbX(new Animated.Value(lowPosition));
    }
    if (!highThumbX) {
      setHighThumbX(new Animated.Value(highPosition));
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
      <View { ...panHandlers } style={styles.touchableArea}/>
    </View>
  );
};

export default Slider;
