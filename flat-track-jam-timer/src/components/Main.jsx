import Constants from 'expo-constants';
import { StyleSheet, View } from 'react-native';

import theme from '../theme';
import ControlBar from './ControlBar';
import Timer from './Timer';

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: theme.colors.mainBackground,
  },
});

const Main = () => {
  return (
    <View style={styles.container}>
      <ControlBar />
      <Timer />
    </View>
  );
};

export default Main;
