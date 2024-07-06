import { View, StyleSheet, useWindowDimensions, Text } from 'react-native';
import { useState, useEffect, useRef, useCallback, useContext } from 'react';

import {
  ShareTechMono_400Regular,
  useFonts,
} from '@expo-google-fonts/share-tech-mono';

import Display from './Display';
import ControlButton from './ControlButton';

import theme from '../../theme';
import ConfigContext from '../../contexts/ConfigContext';

import { timerDispatch, useTimer } from '../../hooks/useTimer';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.mainBackground,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
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
    fontSize: 72,
    fontFamily: 'ShareTechMono_400Regular',
  },
});

const GameStateEnum = Object.freeze({
  PAUSED: 0,
  JAM: 1,
  LINEUP: 2,
  TIMEOUT: 3,
  INTERMISSION: 4,
  RESUME: 5,
});

const Timer = () => {
  const [config, dispatch] = useContext(ConfigContext);
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

  const [periodTimer, periodDispatch] = useTimer(config.periodTime);
  const [periodTime, setPeriodTime] = useState(0);
  const [secondTimer, secondDispatch] = useTimer(config.jamTime);
  const [secondTime, setSecondTime] = useState(0);

  const [currentState, setCurrentState] = useState(GameStateEnum.PAUSED);
  const [clickState, setClickState] = useState(GameStateEnum.JAM);
  const [limitState, setLimitState] = useState(GameStateEnum.PAUSED);

  const [clockCountdown, setClockCountdown] = useState(true);
  const [buttonLabel, setButtonLabel] = useState('Start Jam');

  const [pauseState, setPauseState] = useState({
    periodPaused: false,
    secondPaused: false,
    currentState: GameStateEnum.PAUSED,
    clickState: GameStateEnum.JAM,
    buttonLabel: 'Start Jam',
  });

  const resetAll = useCallback(() => {
    periodDispatch({ type: timerDispatch.RESET });
    secondDispatch({
      type: timerDispatch.RESET,
      payload: { maxTime: config.jamTime },
    });
    setButtonLabel('Start Jam');
    setClickState(GameStateEnum.JAM);
    setLimitState(GameStateEnum.PAUSED);
    setClockCountdown(true);
    setPeriodTime(0);
    setSecondTime(0);
    setCurrentState(GameStateEnum.PAUSED);
    setPauseState({
      periodPaused: false,
      secondPaused: false,
      currentState: GameStateEnum.PAUSED,
      clickState: GameStateEnum.JAM,
      buttonLabel: 'Start Jam',
    });
  }, [periodDispatch, secondDispatch, config.jamTime]);

  const pauseAll = useCallback(
    (event) => {
      setPauseState({
        periodPaused: periodTimer.paused,
        secondPaused: secondTimer.paused,
        currentState,
        clickState,
        buttonLabel,
      });
      const currTime = event.timeStamp;
      if (!periodTimer.paused)
        periodDispatch({ type: timerDispatch.PAUSE, payload: { currTime } });
      if (!secondTimer.paused)
        secondDispatch({ type: timerDispatch.PAUSE, payload: { currTime } });
      setCurrentState(GameStateEnum.PAUSED);
      setClickState(GameStateEnum.RESUME);
      setButtonLabel('Resume');
    },
    [
      buttonLabel,
      clickState,
      currentState,
      periodDispatch,
      periodTimer.paused,
      secondDispatch,
      secondTimer.paused,
    ]
  );

  const resumeAll = useCallback(
    (currTime) => {
      if (!pauseState.periodPaused)
        periodDispatch({ type: timerDispatch.START, payload: { currTime } });
      if (!pauseState.secondPaused)
        secondDispatch({ type: timerDispatch.START, payload: { currTime } });
      setCurrentState(pauseState.currentState);
      setClickState(pauseState.clickState);
      setButtonLabel(pauseState.buttonLabel);
    },
    [
      pauseState.buttonLabel,
      pauseState.clickState,
      pauseState.currentState,
      pauseState.periodPaused,
      pauseState.secondPaused,
      periodDispatch,
      secondDispatch,
    ]
  );

  const interval = useRef(0);

  useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = undefined;
    }
    if (
      (periodTimer.startTime > 0 && !periodTimer.paused) ||
      (secondTimer.startTime > 0 && !secondTimer.paused)
    ) {
      interval.current = setInterval(() => {
        const currTime = Date.now();
        if (periodTimer.startTime > 0 && !periodTimer.paused) {
          const newPT =
            currTime - periodTimer.startTime + periodTimer.pauseTime;
          if (periodTimer.maxTime > 0 && newPT > periodTimer.maxTime) {
            setPeriodTime(periodTimer.maxTime);
            periodDispatch({ type: timerDispatch.LIMIT });
          } else {
            setPeriodTime(newPT);
          }
        } else {
          if (periodTimer.pauseTime === 0) setPeriodTime(0);
        }
        if (secondTimer.startTime > 0 && !secondTimer.paused) {
          const newST =
            currTime - secondTimer.startTime + secondTimer.pauseTime;
          if (secondTimer.maxTime > 0 && newST > secondTimer.maxTime) {
            setSecondTime(secondTimer.maxTime);
            secondDispatch({ type: timerDispatch.LIMIT });
          } else {
            setSecondTime(newST);
          }
        } else {
          if (secondTimer.pauseTime === 0) setSecondTime(0);
        }
      }, 10);
    } else {
      if (periodTimer.pauseTime === 0) setPeriodTime(0);
      if (secondTimer.pauseTime === 0) setSecondTime(0);
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = undefined;
      }
    }
  }, [
    periodDispatch,
    periodTimer.maxTime,
    periodTimer.pauseTime,
    periodTimer.paused,
    periodTimer.startTime,
    secondDispatch,
    secondTimer.maxTime,
    secondTimer.pauseTime,
    secondTimer.paused,
    secondTimer.startTime,
  ]);

  useEffect(() => {
    if (periodTimer.limitTime > 0) {
      setClickState(GameStateEnum.INTERMISSION);
      setLimitState(GameStateEnum.INTERMISSION);
      if (currentState === GameStateEnum.LINEUP)
        updateState(GameStateEnum.INTERMISSION, periodTimer.limitTime);
    }
  }, [currentState, periodTimer.limitTime, updateState]);

  useEffect(() => {
    if (secondTimer.limitTime > 0)
      updateState(limitState, secondTimer.limitTime);
  }, [limitState, secondTimer.limitTime, updateState]);

  const updateState = useCallback(
    (newState, currTime) => {
      setCurrentState(newState);
      switch (newState) {
        case GameStateEnum.JAM:
          periodDispatch({ type: timerDispatch.START, payload: { currTime } });
          secondDispatch({
            type: timerDispatch.RESETANDSTART,
            payload: { maxTime: config.jamTime, currTime },
          });
          setButtonLabel('End Jam');
          setClockCountdown(true);
          setClickState(GameStateEnum.LINEUP);
          setLimitState(GameStateEnum.LINEUP);
          break;
        case GameStateEnum.LINEUP:
          secondDispatch({
            type: timerDispatch.RESETANDSTART,
            payload: { maxTime: config.lineupTime, currTime },
          });
          setButtonLabel('Call Timeout');
          setClockCountdown(false);
          setClickState(GameStateEnum.TIMEOUT);
          setLimitState(GameStateEnum.JAM);
          break;
        case GameStateEnum.TIMEOUT:
          periodDispatch({ type: timerDispatch.PAUSE, payload: { currTime } });
          secondDispatch({
            type: timerDispatch.RESETANDSTART,
            payload: { maxTime: 0, currTime },
          });
          setButtonLabel('Start Jam');
          setClockCountdown(false);
          setClickState(GameStateEnum.JAM);
          setLimitState(GameStateEnum.TIMEOUT);
          break;
        case GameStateEnum.INTERMISSION:
          secondDispatch({
            type: timerDispatch.RESET,
            payload: { maxTime: config.jamTime },
          });
          setClockCountdown(true);
          setButtonLabel('Intermission');
          setClickState(GameStateEnum.PAUSED);
          setLimitState(GameStateEnum.PAUSED);
          break;
      }
    },
    [config.jamTime, config.lineupTime, periodDispatch, secondDispatch]
  );

  const controlButtonPress = useCallback(
    (event) => {
      if (clickState === GameStateEnum.RESUME) resumeAll(event.timeStamp);
      else updateState(clickState, event.timeStamp);
    },
    [clickState, resumeAll, updateState]
  );

  const [fontsLoaded] = useFonts({ ShareTechMono_400Regular });
  if (!fontsLoaded) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <View style={dimensionBoxStyle}>
        <Display
          style={styles.textStyle}
          limit={periodTimer.maxTime}
          time={periodTime}
          countdown={true}
        />
      </View>
      <View style={dimensionBoxStyle}>
        <Display
          style={styles.textStyle}
          limit={secondTimer.maxTime}
          time={secondTime}
          countdown={clockCountdown}
        />
      </View>
      <View style={dimensionBoxStyle}>
        <ControlButton
          style={styles.textStyle}
          label={buttonLabel}
          onPress={controlButtonPress}
        />
      </View>
      <View style={dimensionBoxStyle}>
        <ControlButton
          style={styles.textStyle}
          label={currentState === GameStateEnum.PAUSED ? 'Reset' : 'Pause'}
          onPress={currentState === GameStateEnum.PAUSED ? resetAll : pauseAll}
        />
      </View>
    </View>
  );
};

export default Timer;
