export const isLowCloser = (downX, lowPosition, highPosition) => {
  const distanceFromLow = Math.abs(downX - lowPosition);
  const distanceFromHigh = Math.abs(downX - highPosition);
  return distanceFromLow <= distanceFromHigh;
};

export const getInOutRanges = (lowPosition, highPosition, isLow, allSteps, containerWidth, thumbWidth) => {
  let inStart;
  let inEnd;
  if (isLow) {
    inStart = thumbWidth / 2;
    inEnd = highPosition;
  } else {
    inStart = lowPosition;
    inEnd = containerWidth - thumbWidth / 2;
  }

  const stepWidth = (containerWidth - thumbWidth) / allSteps;
  const steps = Math.round((inEnd - inStart) / stepWidth);
  const inputRange = [inStart];
  const outputRange = [];

  for (let i = 0; i < steps; i += 1) {
    inputRange.push(inStart + stepWidth / 2 + i * stepWidth);
    inputRange.push(inStart + stepWidth / 2 + i * stepWidth);
    outputRange.push(inStart + i * stepWidth - thumbWidth / 2);
    outputRange.push(inStart + i * stepWidth - thumbWidth / 2);
  }
  inputRange.push(inEnd);
  outputRange.push(inEnd - thumbWidth / 2);
  outputRange.push(inEnd - thumbWidth / 2);

  return { inputRange, outputRange };
};
