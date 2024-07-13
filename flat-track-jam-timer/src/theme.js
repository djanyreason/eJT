import { Platform } from 'react-native';
import Constants from 'expo-constants';

const theme = {
  colors: {
    mainBackground: '#3f3f3f',
    headerBackground: '#0f0f0f',
    defaultFont: '#f0f0f0',
    configButtonBackground: '#8b4513',
    submitButtonBackground: '#1b5e20',
    resetButtonBackground: '#c62828',
  },
  fontSizes: {},
  fonts: {
    main: Platform.select({
      android: 'Roboto',
      iOS: 'Arial',
      default: 'System',
    }),
    digits: 'ShareTechMono_400Regular',
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
