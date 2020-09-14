import { useCallback, useState, useRef } from 'react';
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

export const useBoundsLayout = callback => {
  const boundsRef = useRef({ width: 0, height: 0 });
  const onLayout = useCallback(({ nativeEvent }) => {
    const { layout: {width, height}} = nativeEvent;
    const { current: bounds } = boundsRef;
    const { width: w, height: h } = bounds;
    if (w !== width || h !== height) {
      Object.assign(bounds, { width, height });
      if (callback) {
        callback(width, height);
      }
    }
  }, [callback]);
  return [boundsRef, onLayout];
};
