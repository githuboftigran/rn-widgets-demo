import { useCallback, useState } from 'react';
import {getInOutRanges} from './helpers';
import {Animated} from 'react-native';
export const useLowHigh = (lowProp, highProp, min, max) => {
  const [lowState, setLow] = useState(min);
  const [highState, setHigh] = useState(max);

  // Props have higher priority.
  // If no props are passed, use internal state variables.
  const low = lowProp === undefined ? lowState : lowProp;
  const high = highProp === undefined ? highState : highProp;
  return { low, high, setLow, setHigh };
};

export const useLabelBounds = (translateX, xOffset, thumbWidth, containerWidth, allSteps) => {

  const [labelBounds, setLabelBounds] = useState({ width: 0, height: 0 });

  const handleLabelLayout = useCallback(({ nativeEvent }) => {
    const { layout: { width, height }} = nativeEvent;
    if (labelBounds.width !== width || labelBounds.height !== height) {
      setLabelBounds({ width, height });
    }
  }, [labelBounds.width, labelBounds.height]);

  let labelTransform;
  if (thumbWidth && containerWidth && allSteps) {
    const { inputRange, outputRange } = getInOutRanges(thumbWidth / 2, containerWidth - thumbWidth / 2, allSteps, containerWidth, thumbWidth);
    labelTransform = {
      top: -labelBounds.height,
      left: -labelBounds.width / 2,
      transform: [{ translateX: Animated.subtract(translateX, xOffset).interpolate({ inputRange, outputRange }) }],
    };
  }

  return { handleLabelLayout, labelTransform };
};

export const useWidthLayout = (widthSetter, xSetter) => {
  return useCallback(({ nativeEvent }) => {
    const { layout: {x, width}} = nativeEvent;
    widthSetter(width);
    if (xSetter) {
      xSetter(x);
    }
  }, [widthSetter, xSetter]);
};
