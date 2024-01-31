import { View, StyleSheet, Text } from 'react-native';

import theme from '../../theme';

const styles = StyleSheet.create({
  container: {
    height: theme.layout.topBarHeight,
    backgroundColor: theme.colors.headerBackground,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.layout.appPadding,
  },
  textStyle: {
    color: theme.colors.defaultFont,
  },
  // ...
});

const ControlBar = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>Flat Track Jam Timer Application Hi</Text>
    </View>
  );
};

export default ControlBar;
