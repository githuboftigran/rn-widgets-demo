import React, { useCallback, useState, useRef } from 'react';
import {Animated, View} from 'react-native';
import {clamp} from './helpers';
import styles from './styles';

export const useLowHigh = (lowProp, highProp, min, max) => {
  const [lowState, setLow] = useState(min);
  const [highState, setHigh] = useState(max);

  // Props have higher priority.
  // If no props are passed, use internal state variables.
  const low = lowProp === undefined ? lowState : lowProp;
  const high = highProp === undefined ? highState : highProp;
  return { low, high, setLow, setHigh };
};

export const useWidthLayout = (widthRef, callback) => {
  return useCallback(({ nativeEvent }) => {
    const { layout: {width}} = nativeEvent;
    const { current: w } = widthRef;
    if (w !== width) {
      widthRef.current = width;
      if (callback) {
        callback(width);
      }
    }
  }, [callback, widthRef]);
};

export const useBoundsLayout = (boundsRef, callback) => {
  return useCallback(({ nativeEvent }) => {
    const { layout: {width, height}} = nativeEvent;
    const { current: bounds } = boundsRef;
    const { width: w, height: h } = bounds;
    if (w !== width || h !== height) {
      Object.assign(bounds, { width, height });
      if (callback) {
        callback(width, height);
      }
    }
  }, [boundsRef, callback]);
};

export const useThumbFollower = (containerWidthRef, gestureStateRef, content, isPressed, allowOverflow, key) => {
  const xRef = useRef(new Animated.Value(0));
  const widthRef = useRef(0);

  const { current: x } = xRef;

  const update = useCallback(thumbPositionInView => {
    const { current: width } = widthRef;
    const { current: containerWidth } = containerWidthRef;
    const position = thumbPositionInView - width / 2;
    xRef.current.setValue(allowOverflow ? position : clamp(position, 0, containerWidth - width));
  }, [widthRef, containerWidthRef, allowOverflow]);

  const handleLayout = useWidthLayout(widthRef, () => {
    update(gestureStateRef.current.lastPosition);
  });

  const transform = { transform: [{ translateX: x }]};
  const follower = (
    <Animated.View key={key} style={[transform, { opacity: isPressed ? 1 : 0 }]}>
      <View onLayout={handleLayout}>
        {content}
      </View>
    </Animated.View>
  );
  return [follower, update];
};

export const useLabelContainerProps = floating => {
  const [labelContainerHeight, setLabelContainerHeight] = useState(0);
  const onLayout = useCallback(({ nativeEvent }) => {
    const { layout: {height}} = nativeEvent;
    setLabelContainerHeight(height);
  }, []);

  const style = [floating ? styles.labelFloatingContainer : styles.labelFixedContainer, { top: -labelContainerHeight }];
  return { style, onLayout: floating ? onLayout : undefined };
};
