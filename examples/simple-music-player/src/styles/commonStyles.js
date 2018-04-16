import { StyleSheet } from 'react-native';

const CommonStyleSheet = StyleSheet.create({
  card: {
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: {
      height: 0.3,
      width: 0.3
    },
    elevation: 1,
    overflow: 'hidden'
  }
});

export default CommonStyleSheet;
