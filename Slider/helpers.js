export const isLowCloser = (downX, lowPosition, highPosition) => {
  const distanceFromLow = Math.abs(downX - lowPosition);
  const distanceFromHigh = Math.abs(downX - highPosition);
  return distanceFromLow <= distanceFromHigh;
};

export const getInOutRanges = (inStart, inEnd, allSteps, containerWidth, thumbWidth) => {

  const stepWidth = (containerWidth - thumbWidth) / (allSteps - 1);
  const steps = Math.round((inEnd - inStart) / stepWidth);
  const inputRange = [inStart];
  const outputRange = [];

  for (let i = 0; i < steps; i += 1) {
    inputRange.push(inStart + stepWidth / 2 + i * stepWidth);
    inputRange.push(inStart + stepWidth / 2 + i * stepWidth);
    outputRange.push(inStart + i * stepWidth);
    outputRange.push(inStart + i * stepWidth);
  }
  inputRange.push(inEnd);
  outputRange.push(inEnd);
  outputRange.push(inEnd);

  return { inputRange, outputRange };
};
