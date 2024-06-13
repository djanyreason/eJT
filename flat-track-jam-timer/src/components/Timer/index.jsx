import {
  View,
  StyleSheet,
  Text,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';

import Display from './Display';

import theme from '../../theme';

import { useTimer } from '../../hooks/useTimer';
import { formatTime } from '../../util';

const periodTime = [30, 0];
const jamTime = [2, 0];
const lineupTime = [0, 30];

//const msTime = (time) => 1000 * (time[0] * 60 + time[1]);

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
/*
const GameStateEnum = Object.freeze({
  COMING_UP: 0,
  TO_FIVE_SECONDS: 1,
});*/

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

  /*
  const [status, setStatus] = useState(GameStateEnum.COMING_UP);
  const [buttonLabel, setButtonLabel] = useState('Five Seconds');

  const periodTimer = useTimer(msTime(periodTime), setStatus(GameStateEnum.TO_FIVE_SECONDS));
  const secondTimer
  

  return (
    <View style={styles.container}>
      <View style={dimensionBoxStyle}>
        <Text style={styles.textStyle}>
          {formatTime(periodTimeMS - periodTimer.time)}
        </Text>
      </View>
      <View style={dimensionBoxStyle}>
        <Text style={styles.textStyle}>
          {lineupTimer.running
            ? formatTime(lineupTimer.time)
            : timeoutTimer.running
            ? formatTime(timeoutTimer.time)
            : formatTime(jamTimeMS - jamTimer.time)}
        </Text>
      </View>
      <View style={dimensionBoxStyle}>
        <Pressable
          onPress={
            lineupTimer.running
              ? callTimeout
              : jamTimer.running
              ? endJam
              : endTimeout
          }
        >
          <Text style={styles.textStyle}>{buttonLabel}</Text>
        </Pressable>
      </View>
      <View style={dimensionBoxStyle}>
        <Pressable onPress={resetAll}>
          <Text style={styles.textStyle}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
  */
  const periodTimeMS = (periodTime[0] * 60 + periodTime[1]) * 1000;
  const jamTimeMS = (jamTime[0] * 60 + jamTime[1]) * 1000;
  const lineupTimeMS = (lineupTime[0] * 60 + lineupTime[1]) * 1000;
  const lineupFunc = () => {
    console.log('Hello');
  };
  const periodTimer = useTimer(periodTimeMS);
  const jamTimer = useTimer(jamTimeMS);
  const lineupTimer = useTimer(lineupTimeMS, lineupFunc);
  const timeoutTimer = useTimer();

  const [buttonLabel, setButtonLabel] = useState('Start Jam');

  const endTimeout = () => {
    timeoutTimer.pauseTimer();
    timeoutTimer.resetTimer();
    periodTimer.startTimer();
    jamTimer.startTimer();
    setButtonLabel('End Jam');
  };

  const endJam = useCallback(() => {
    const resetJam = jamTimer.resetTimer;
    resetJam();
    if (periodTimer.limit) {
      setButtonLabel('Reset Clocks');
    } else {
      const startLineup = lineupTimer.startTimer;
      startLineup();
      setButtonLabel('Timeout');
    }
  }, [jamTimer.resetTimer, periodTimer.limit, lineupTimer.startTimer]);

  const callTimeout = () => {
    lineupTimer.resetTimer();
    periodTimer.pauseTimer();
    timeoutTimer.startTimer();
    setButtonLabel('Start Jam');
  };

  const resetAll = () => {
    periodTimer.resetTimer();
    jamTimer.resetTimer();
    lineupTimer.resetTimer();
    timeoutTimer.resetTimer();
  };

  useEffect(() => {
    const resetLineup = lineupTimer.resetTimer;
    const startJam = jamTimer.startTimer;
    if (lineupTimer.limit) {
      resetLineup();
      startJam();
      setButtonLabel('End Jam');
    } else if (jamTimer.limit) endJam();
  }, [
    lineupTimer.limit,
    jamTimer.limit,
    lineupTimer.resetTimer,
    jamTimer.startTimer,
    endJam,
  ]);

  return (
    <View style={styles.container}>
      <View style={dimensionBoxStyle}>
        <Display
          style={styles.textStyle}
          limit={periodTimeMS}
          time={periodTimer.time}
          countdown={true}
        />
      </View>
      <View style={dimensionBoxStyle}>
        <Display
          style={styles.textStyle}
          limit={jamTimeMS}
          time={
            lineupTimer.running
              ? lineupTimer.time
              : timeoutTimer.running
              ? timeoutTimer.time
              : jamTimer.time
          }
          countdown={!lineupTimer.running && !timeoutTimer.running}
        />
      </View>
      <View style={dimensionBoxStyle}>
        <Pressable
          onPress={
            lineupTimer.running
              ? callTimeout
              : jamTimer.running
              ? endJam
              : endTimeout
          }
        >
          <Text style={styles.textStyle}>{buttonLabel}</Text>
        </Pressable>
      </View>
      <View style={dimensionBoxStyle}>
        <Pressable onPress={resetAll}>
          <Text style={styles.textStyle}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Timer;
