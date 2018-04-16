import { StyleSheet, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');

export const fontFamily = 'Open Sans';

const FontStyleSheet = StyleSheet.create({
  base: {
    fontFamily
  },
  title: {
    fontFamily,
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 4
  },
  subtitle: {
    fontFamily,
    fontSize: 14
  },
  h28: {
    fontFamily,
    fontWeight: '700',
    fontSize: 28
  },
  h21: {
    fontFamily,
    fontWeight: '700',
    fontSize: 21
  },
  h14: {
    fontFamily,
    fontWeight: '600',
    fontSize: 14
  },
  p40: {
    fontFamily,
    fontSize: 40
  },
  p32: {
    fontFamily,
    fontSize: 32
  },
  p28: {
    fontFamily,
    fontSize: 28
  },
  p24: {
    fontFamily,
    fontSize: 24
  },
  p18: {
    fontFamily,
    fontSize: 18
  },
  p14: {
    fontFamily,
    fontSize: 14
  },
  p12: {
    fontFamily,
    fontSize: 12
  }
});

export default FontStyleSheet;
