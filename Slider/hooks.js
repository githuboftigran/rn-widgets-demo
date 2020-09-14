import { useCallback, useState, useRef } from 'react';
import {Animated} from 'react-native';
import {clamp} from './helpers';
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

export const useFollowThumb = (containerWidthRef, gestureStateRef) => {
  const xRef = useRef(new Animated.Value(0));
  const yRef = useRef(new Animated.Value(0));
  const boundsRef = useRef({ width: 0, height: 0 });

  const { current: x } = xRef;
  const { current: y } = yRef;

  const update = useCallback(thumbPositionInView => {
    const { current: {width, height} } = boundsRef;
    const { current: containerWidth } = containerWidthRef;
    xRef.current.setValue(clamp(thumbPositionInView - width / 2, 0, containerWidth - width));
    yRef.current.setValue(-height);
  }, [boundsRef, containerWidthRef]);

  const handleLayout = useBoundsLayout(boundsRef, () => {
    update(gestureStateRef.current.lastPosition);
  });

  const transform = {
    transform: [
      {translateX: x},
      {translateY: y},
    ],
  };
  return [update, transform, handleLayout];
};
