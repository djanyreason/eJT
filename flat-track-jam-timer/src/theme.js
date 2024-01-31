import { Platform } from 'react-native';
import Constants from 'expo-constants';

const theme = {
  colors: {
    mainBackground: '#3f3f3f',
    headerBackground: '#0f0f0f',
    defaultFont: '#f0f0f0',
  },
  fontSizes: {},
  fonts: {
    main: Platform.select({
      android: 'Roboto',
      iOS: 'Arial',
      default: 'System',
    }),
  },
  fontWeights: {
    normal: '400',
    bold: '700',
  },
  layout: {
    topBarHeight: 50,
    appPadding: 5,
  },
};

export default theme;
