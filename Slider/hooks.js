import React, { useCallback, useState, useRef } from 'react';
import {Animated, View} from 'react-native';
import {clamp} from './helpers';
import styles from './styles';
import LabelContainer from './LabelContainer';

export const useLowHigh = (lowProp, highProp, min, max, step) => {

  const validLowProp = lowProp === undefined ? min : clamp(lowProp, min, max);
  const validHighProp = highProp === undefined ? max : clamp(highProp, min, max);
  const inPropsRef = useRef({ low: validLowProp, high: validHighProp });
  const { low: lowState, high: highState } = inPropsRef.current;

  // Props have higher priority.
  // If no props are passed, use internal state variables.
  const low = clamp(lowProp === undefined ? lowState : lowProp, min, max);
  const high = clamp(highProp === undefined ? highState : highProp, min, max);

  // Always update values of refs so pan responder will have updated values
  Object.assign(inPropsRef.current, { low, high, min, max, step });

  const setLow = value => inPropsRef.current.low = value;
  const setHigh = value => inPropsRef.current.high = value;
  return { inPropsRef, setLow, setHigh };
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

export const useThumbFollower = (containerWidthRef, gestureStateRef, renderContent, isPressed, allowOverflow) => {
  const xRef = useRef(new Animated.Value(0));
  const widthRef = useRef(0);
  const contentContainerRef = useRef(null);

  const { current: x } = xRef;

  const update = useCallback((thumbPositionInView, value) => {
    const { current: width } = widthRef;
    const { current: containerWidth } = containerWidthRef;
    const position = thumbPositionInView - width / 2;
    xRef.current.setValue(allowOverflow ? position : clamp(position, 0, containerWidth - width));
    contentContainerRef.current.setValue(value);
  }, [widthRef, containerWidthRef, allowOverflow]);

  const handleLayout = useWidthLayout(widthRef, () => {
    update(gestureStateRef.current.lastPosition, gestureStateRef.current.lastValue);
  });

  if (!renderContent) {
    return [];
  }

  const transform = { transform: [{ translateX: x }]};
  const follower = (
    <Animated.View style={[transform, { opacity: isPressed ? 1 : 0 }]}>
      <LabelContainer
        onLayout={handleLayout}
        ref={contentContainerRef}
        renderContent={renderContent}
      />
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
