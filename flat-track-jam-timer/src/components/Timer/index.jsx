import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import Display from './Display';
import ControlButton from './ControlButton';

import theme from '../../theme';

import { timerDispatch, useTimer } from '../../hooks/useTimer';

const periodTime = [30, 0];
const jamTime = [2, 0];
const lineupTime = [0, 30];

const msTime = (time) => 100 * (time[0] * 60 + time[1]);

const jamTimeMS = msTime(jamTime);
const periodTimeMS = msTime(periodTime);
const lineupTimeMS = msTime(lineupTime);

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

const GameStateEnum = Object.freeze({
  COMING_UP: 0,
  JAM: 1,
  LINEUP: 2,
  TIMEOUT: 3,
  INTERMISSION: 4,
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

  const [periodTimer, periodDispatch] = useTimer(periodTimeMS);
  const [periodTime, setPeriodTime] = useState(0);
  const [secondTimer, secondDispatch] = useTimer(jamTimeMS);
  const [secondTime, setSecondTime] = useState(0);

  const [currentState, setCurrentState] = useState(GameStateEnum.COMING_UP);
  const [clickState, setClickState] = useState(GameStateEnum.JAM);
  const [limitState, setLimitState] = useState(GameStateEnum.COMING_UP);

  const [clockCountdown, setClockCountdown] = useState(true);
  const [buttonLabel, setButtonLabel] = useState('Start Jam');

  const resetAll = useCallback(() => {
    periodDispatch({ type: timerDispatch.RESET });
    secondDispatch({
      type: timerDispatch.RESET,
      payload: { maxTime: jamTimeMS },
    });
    setButtonLabel('Start Jam');
    setClickState(GameStateEnum.JAM);
    setLimitState(GameStateEnum.COMING_UP);
    setClockCountdown(true);
    setPeriodTime(0);
    setSecondTime(0);
    setCurrentState(GameStateEnum.COMING_UP);
  }, [periodDispatch, secondDispatch]);

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
    if (periodTimer.limit) {
      setClickState(GameStateEnum.INTERMISSION);
      setLimitState(GameStateEnum.INTERMISSION);
      if (currentState === GameStateEnum.LINEUP)
        updateState(GameStateEnum.INTERMISSION, periodTimer.limitTime);
    }
  }, [currentState, periodTimer.limit, periodTimer.limitTime, updateState]);

  useEffect(() => {
    if (secondTimer.limit) updateState(limitState, secondTimer.limitTime);
  }, [limitState, secondTimer.limit, secondTimer.limitTime, updateState]);

  const updateState = useCallback(
    (newState, currTime) => {
      setCurrentState(newState);
      switch (newState) {
        case GameStateEnum.JAM:
          periodDispatch({ type: timerDispatch.START, payload: { currTime } });
          secondDispatch({
            type: timerDispatch.RESETANDSTART,
            payload: { maxTime: jamTimeMS, currTime },
          });
          setButtonLabel('End Jam');
          setClockCountdown(true);
          setClickState(GameStateEnum.LINEUP);
          setLimitState(GameStateEnum.LINEUP);
          break;
        case GameStateEnum.LINEUP:
          secondDispatch({
            type: timerDispatch.RESETANDSTART,
            payload: { maxTime: lineupTimeMS, currTime },
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
            payload: { maxTime: jamTimeMS },
          });
          setClockCountdown(true);
          setButtonLabel('Intermission');
          setClickState(GameStateEnum.COMING_UP);
          setLimitState(GameStateEnum.COMING_UP);
      }
    },
    [periodDispatch, secondDispatch]
  );

  const handlePress = useCallback(
    (newState) => {
      const pressTime = Date.now();
      updateState(newState, pressTime);
    },
    [updateState]
  );
  /*
  const testTimer = useTimer(30 * 1000);
  const resetAndStart = async () => {
    await testTimer.dispatch({ type: timerDispatch.RESET });
    await testTimer.dispatch({ type: timerDispatch.START });
  };

  const testObj = useMemo(() => {
    return {
      name: 'test',
      func: () => console.log('callback'),
    };
  }, []);

  useEffect(() => {
    console.log(testObj.name);
  }, [testObj]);

  return (
    <View style={styles.container}>
      <View style={dimensionBoxStyle}>
        <Display
          style={styles.textStyle}
          limit={testTimer.maxTime}
          time={testTimer.time}
          countdown={true}
        />
      </View>
      <View style={dimensionBoxStyle}>
        <ControlButton
          style={styles.textStyle}
          label={!testTimer.timer.paused ? 'Pause' : 'Start'}
          onPress={
            !testTimer.timer.paused
              ? () => testTimer.dispatch({ type: timerDispatch.PAUSE })
              : () => testTimer.dispatch({ type: timerDispatch.START })
          }
        />
      </View>
      <View style={dimensionBoxStyle}>
        <ControlButton
          style={styles.textStyle}
          label={'Reset and Stop'}
          onPress={() => testTimer.dispatch({ type: timerDispatch.RESET })}
        />
      </View>
      <View style={dimensionBoxStyle}>
        <ControlButton
          style={styles.textStyle}
          label={'Reset and Run'}
          onPress={resetAndStart}
        />
      </View>
    </View>
  );

  const [periodTimer, periodDispatch] = useTimer(periodTimeMS);
  const [secondTimer, secondDispatch] = useTimer(jamTimeMS);

  const [currentState, setCurrentState] = useState(GameStateEnum.COMING_UP);
  const [clickState, setClickState] = useState(GameStateEnum.JAM);
  const [limitState, setLimitState] = useState(GameStateEnum.COMING_UP);

  const [clockCountdown, setClockCountdown] = useState(true);
  const [buttonLabel, setButtonLabel] = useState('Start Jam');

  const resetAll = useCallback(() => {
    periodDispatch({ type: timerDispatch.RESET });
    secondDispatch({
      type: timerDispatch.RESET,
      payload: { maxTime: jamTimeMS },
    });
    setButtonLabel('Start Jam');
    setClickState(GameStateEnum.JAM);
    setLimitState(GameStateEnum.COMING_UP);
    setClockCountdown(true);
  }, [periodDispatch, secondDispatch]);

  useEffect(() => {
    if (periodTimer.timer.limit) {
      setClickState(GameStateEnum.INTERMISSION);
      setLimitState(GameStateEnum.INTERMISSION);
      if (currentState === GameStateEnum.LINEUP)
        updateState(GameStateEnum.INTERMISSION);
    }
  }, [currentState, periodTimer.timer.limit, updateState]);

  useEffect(() => {
    if (secondTimer.timer.limit) updateState(limitState);
  }, [limitState, secondTimer.timer.limit, updateState]);

  const updateState = useCallback(
    (newState) => {
      setCurrentState(newState);
      switch (newState) {
        case GameStateEnum.JAM:
          periodDispatch({ type: timerDispatch.START });
          secondDispatch({
            type: timerDispatch.RESET,
            payload: { maxTime: jamTimeMS },
          });
          secondDispatch({ type: timerDispatch.START });
          setButtonLabel('End Jam');
          setClockCountdown(true);
          setClickState(GameStateEnum.LINEUP);
          setLimitState(GameStateEnum.LINEUP);
          break;
        case GameStateEnum.LINEUP:
          secondDispatch({
            type: timerDispatch.RESET,
            payload: { maxTime: lineupTimeMS },
          });
          secondDispatch({ type: timerDispatch.START });
          setButtonLabel('Call Timeout');
          setClockCountdown(false);
          setClickState(GameStateEnum.TIMEOUT);
          setLimitState(GameStateEnum.JAM);
          break;
        case GameStateEnum.TIMEOUT:
          periodDispatch({ type: timerDispatch.PAUSE });
          secondDispatch({
            type: timerDispatch.RESET,
            payload: { maxTime: 0 },
          });
          secondDispatch({ type: timerDispatch.START });
          setButtonLabel('Start Jam');
          setClockCountdown(false);
          setClickState(GameStateEnum.JAM);
          setLimitState(GameStateEnum.TIMEOUT);
          break;
        case GameStateEnum.INTERMISSION:
          secondDispatch({
            type: timerDispatch.RESET,
            payload: { maxTime: jamTimeMS },
          });
          setClockCountdown(true);
          setButtonLabel('Intermission');
          setClickState(GameStateEnum.COMING_UP);
          setLimitState(GameStateEnum.COMING_UP);
      }
    },
    [periodDispatch, secondDispatch]
  );*/

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
          onPress={() => handlePress(clickState)}
        />
      </View>
      <View style={dimensionBoxStyle}>
        <ControlButton
          style={styles.textStyle}
          label={'Reset'}
          onPress={resetAll}
        />
      </View>
    </View>
  );

  /*
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
    setButtonLabel('Start Jam');
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
        <ControlButton
          style={styles.textStyle}
          label={buttonLabel}
          onPress={
            lineupTimer.running
              ? callTimeout
              : jamTimer.running
              ? endJam
              : endTimeout
          }
        />
      </View>
      <View style={dimensionBoxStyle}>
        <ControlButton
          style={styles.textStyle}
          label={'Reset'}
          onPress={resetAll}
        />
      </View>
    </View>
  );
  */
};

export default Timer;
