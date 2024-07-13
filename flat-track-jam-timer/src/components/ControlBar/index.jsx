import { View, StyleSheet } from 'react-native';

import NavButton from './NavButton';

import theme from '../../theme';

const styles = StyleSheet.create({
  container: {
    height: theme.layout.topBarHeight,
    backgroundColor: theme.colors.headerBackground,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //    padding: theme.layout.appPadding,
  },
});

const ControlBar = () => {
  return (
    <View style={styles.container}>
      <NavButton content={'Jam Timer'} route={'/'} />
      <NavButton content={'Configuration'} route={'/config'} />
    </View>
  );
};

export default ControlBar;
