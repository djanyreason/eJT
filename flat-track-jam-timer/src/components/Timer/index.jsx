import {
  View,
  StyleSheet,
  Text,
  useWindowDimensions,
  Pressable,
} from 'react-native';

import theme from '../../theme';

import { useTimer } from '../../hooks/useTimer';
import { formatTime } from '../../util';

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
    fontSize: 48,
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

  const aTimer = useTimer(1000);

  return (
    <View style={styles.container}>
      <View style={dimensionBoxStyle}>
        <Text style={styles.textStyle}>{formatTime(aTimer.time)}</Text>
      </View>
      <View style={dimensionBoxStyle}>
        <Pressable
          onPress={
            aTimer.complete
              ? () => {
                  aTimer.resetTimer(100000);
                }
              : aTimer.paused
              ? aTimer.startTimer
              : aTimer.pauseTimer
          }
        >
          <Text style={styles.textStyle}>
            {aTimer.complete
              ? 'Reset Timer'
              : aTimer.paused
              ? 'Start Timer'
              : 'PauseTimer'}
          </Text>
        </Pressable>
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
