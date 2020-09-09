import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lowThumbContainer: {

  },
  highThumbContainer: {
    position: 'absolute',
  },
  railsContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelContainer: {
    position: 'absolute',
  },
  touchableArea: {
    ...StyleSheet.absoluteFillObject,
  },
});
