import { useCallback, useState } from 'react';
export const useLowHigh = (lowProp, highProp, min, max) => {
  const [lowState, setLow] = useState(min);
  const [highState, setHigh] = useState(max);

  // Props have higher priority.
  // If no props are passed, use internal state variables.
  const low = lowProp === undefined ? lowState : lowProp;
  const high = highProp === undefined ? highState : highProp;
  return { low, high, setLow, setHigh };
};

export const useLabelBounds = (thumbWidth, translateX) => {

  const [labelBounds, setLabelBounds] = useState({ width: 0, height: 0 });

  const handleLabelLayout = useCallback(({ nativeEvent }) => {
    const { layout: { width, height }} = nativeEvent;
    if (labelBounds.width !== width || labelBounds.height !== height) {
      setLabelBounds({ width, height });
    }
  }, [labelBounds.width, labelBounds.height]);

  const labelTransform = {
    left: -(labelBounds.width - thumbWidth) / 2,
    top: -labelBounds.height,
    transform: [{ translateX }],
  };

  return { handleLabelLayout, labelTransform };
};

export const useWidthLayout = setter => {
  return useCallback(({ nativeEvent }) => {
    const { layout: {width}} = nativeEvent;
    setter(width);
  }, [setter]);
};
