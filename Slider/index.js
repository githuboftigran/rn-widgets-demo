import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Animated, PanResponder, View } from 'react-native';
import styles from './styles';
import {useThumbFollower, useLowHigh, useWidthLayout, useLabelContainerProps} from './hooks';
import {clamp, getValueForPosition, isLowCloser} from './helpers';

const trueFunc = () => true;

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

  const { low, high, setLow, setHigh } = useLowHigh(lowProp, highProp, min, max);
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
    const { current: lowThumbX } = lowThumbXRef;
    const { current: highThumbX } = highThumbXRef;
    const lowPosition = (low - min) / (max - min) * (containerWidth - thumbWidth);
    const highPosition = (high - min) / (max - min) * (containerWidth - thumbWidth);
    lowThumbX.setValue(lowPosition);
    highThumbX.setValue(highPosition);
    onValueChanged(low, high);
  }, [high, low, max, min, onValueChanged]);

  const handleContainerLayout = useWidthLayout(containerWidthRef, handleFixedLayoutsChange);
  const handleThumbLayout = useWidthLayout(thumbWidthRef, handleFixedLayoutsChange);

  const lowTransform = { transform: [{translateX: lowThumbX}]};
  const highTransform = { transform: [{translateX: highThumbX}]};

  const inPropsRef = useRef({ low, high, min, max, step });
  // Always update values of refs so pan responder will have updated values
  Object.assign(inPropsRef.current, { low, high, min, max, step });

  const { isLow } = gestureStateRef.current;
  const pointerX = useRef(new Animated.Value(0)).current;

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

        const { low, high, min, max, step } = inPropsRef.current;
        const thumbWidth = thumbWidthRef.current;
        const containerWidth = containerWidthRef.current;

        const lowPosition = thumbWidth / 2 + (low - min) / (max - min) * (containerWidth - thumbWidth);
        const highPosition = thumbWidth / 2 + (high - min) / (max - min) * (containerWidth - thumbWidth);

        const isLow = isLowCloser(downX, lowPosition, highPosition);
        gestureStateRef.current.isLow = isLow;

        const handlePositionChange = positionInView => {
          const minValue = isLow ? min : low;
          const maxValue = isLow ? high : max;
          const value = clamp(getValueForPosition(positionInView, containerWidth, thumbWidth, min, max, step), minValue, maxValue);
          const availableSpace = containerWidth - thumbWidth;
          const absolutePosition = (value - min) / (max - min) * availableSpace;
          gestureStateRef.current.lastValue = value;
          gestureStateRef.current.lastPosition = absolutePosition + thumbWidth / 2;
          (isLow ? lowThumbX : highThumbX).setValue(absolutePosition);
          if (onValueChanged) {
            onValueChanged(isLow ? value : low, isLow ? high : value);
            (isLow ? setLow : setHigh)(value);
            updateLabelComponents(gestureStateRef.current.lastPosition);
          }
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
  }, [pointerX, onValueChanged, setLow, setHigh, updateLabelComponents]);

  useEffect(() => {
    handleFixedLayoutsChange();
  }, [handleFixedLayoutsChange]);

  const lowThumb = renderThumb();
  const highThumb = renderThumb();
  const rail = renderRail();

  return (
    <View style={[style, styles.root]}>
      <View {...labelContainerProps}>
        {labelComponents}
      </View>
      <View onLayout={handleContainerLayout} style={styles.controlsContainer}>
        <View style={[styles.railsContainer, { marginHorizontal: thumbWidthRef.current / 2 }]}>
          {rail}
        </View>
        <Animated.View style={[styles.lowThumbContainer, lowTransform]} onLayout={handleThumbLayout}>
          {lowThumb}
        </Animated.View>
        <Animated.View style={[styles.highThumbContainer, highTransform]}>
          {highThumb}
        </Animated.View>
        <View { ...panHandlers } style={styles.touchableArea} collapsable={false}/>
      </View>
    </View>
  );
};

export default Slider;
