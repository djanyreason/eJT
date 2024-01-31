import { View, StyleSheet, Text, useWindowDimensions } from 'react-native';

import theme from '../../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.mainBackground,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.layout.appPadding,
    paddingTop: 0,
    flexGrow: 1,
  },
  boxStyle: {
    marginTop: theme.layout.appPadding,
    backgroundColor: theme.colors.headerBackground,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 0,
    flexShrink: 0,
  },
  textStyle: {
    color: theme.colors.defaultFont,
  },
});

const Timer = () => {
  const { height, width } = useWindowDimensions();
  const modHeight =
    height - 6 * theme.layout.appPadding - theme.layout.appPadding;
  const modWidth = width - 2 * theme.layout.appPadding;

  const limiter = modHeight / modWidth < 2 / 4.5 ? 'height' : 'width';

  const dimensionBoxStyle = {
    ...styles.boxStyle,
    height: limiter === 'height' ? modHeight : (modWidth * 2) / 4.5,
    width: limiter === 'width' ? modWidth : (modHeight * 4.5) / 2,
  };

  return (
    <View style={styles.container}>
      <View style={dimensionBoxStyle}>
        <Text style={styles.textStyle}>Timer 1</Text>
      </View>
      <View style={dimensionBoxStyle}>
        <Text style={styles.textStyle}>Button 1</Text>
      </View>
      <View style={dimensionBoxStyle}>
        <Text style={styles.textStyle}>Timer 2</Text>
      </View>
      <View style={dimensionBoxStyle}>
        <Text style={styles.textStyle}>Button 2</Text>
      </View>
    </View>
  );
};

export default Timer;
