import { useState, useEffect, useRef, useReducer } from 'react';

const defaultState = {
  startTime: 0,
  pauseTime: 0,
  maxTime: 0,
  paused: true,
  limit: false,
  limitTime: 0,
};

const timerReducer = (state, action) => {
  switch (action.type) {
    case timerDispatch.START:
      if (!state.paused || state.limit) {
        return state;
      } else {
        return {
          ...state,
          startTime: action.payload?.currTime ?? Date.now(),
          paused: false,
        };
      }
    case timerDispatch.PAUSE:
      if (state.paused) {
        return state;
      } else {
        return {
          ...state,
          paused: true,
          pauseTime:
            state.pauseTime +
            (action.payload?.currTime ?? Date.now()) -
            state.startTime,
          startTime: 0,
        };
      }
    case timerDispatch.RESET:
      return {
        ...defaultState,
        maxTime: action.payload?.maxTime ?? state.maxTime,
      };
    case timerDispatch.LIMIT:
      return {
        ...state,
        paused: true,
        startTime: 0,
        pauseTime: state.maxTime,
        limit: true,
        limitTime: state.startTime - state.pauseTime + state.maxTime,
      };
    case timerDispatch.RESETANDSTART:
      return {
        ...defaultState,
        startTime: action.payload?.currTime ?? Date.now(),
        paused: false,
        maxTime: action.payload?.maxTime ?? state.maxTime,
      };
    default:
      return state;
  }
};

export const timerDispatch = Object.freeze({
  START: 0,
  PAUSE: 1,
  RESET: 2,
  LIMIT: 3,
  RESETANDSTART: 4,
});

export const useTimer = (maxTime = 0) => {
  const [timer, dispatch] = useReducer(timerReducer, {
    ...defaultState,
    maxTime,
  });
  /*const [time, setTime] = useState(0);

  const interval = useRef(0);

  useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = undefined;
    }
    if (timer.startTime > 0 && !timer.paused) {
      interval.current = setInterval(() => {
        const newTime = Date.now() - timer.startTime + timer.pauseTime;
        if (timer.maxTime > 0 && newTime > timer.maxTime) {
          setTime(timer.maxTime);
          dispatch({ type: timerDispatch.LIMIT });
        } else {
          setTime(newTime);
        }
      }, 10);
    } else {
      if (timer.pauseTime === 0) setTime(0);
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = undefined;
      }
    }
  }, [
    timer,
    /*timer.startTime, timer.paused, timer.maxTime, timer.pauseTime, dispatch,
  ]);*/

  return [timer, dispatch];
};

/*
export const useTimer = (timeLimit = 0, limFunc = null) => {
  const [time, setTime] = useState(0);
  const [maxTime, setMaxTime] = useState(timeLimit);
  const [startTime, setStartTime] = useState(0);
  const [pauseTime, setPauseTime] = useState(0);
  const [paused, setPaused] = useState(true);
  const [limit, setLimit] = useState(false);
  const [limitCall, setLimitCall] = useState(() => limFunc);

  const interval = useRef(0);

  useEffect(() => {
    console.log(startTime, pauseTime, maxTime, paused, limit);
    if (startTime > 0 && !paused && !limit) {
      interval.current = setInterval(() => {
        const newTime = Date.now() - startTime + pauseTime;
        if (maxTime > 0 && newTime > maxTime) {
          setTime(maxTime);
          setLimit(true);
          setPaused(true);
          setStartTime(0);
        } else {
          setTime(Date.now() - startTime + pauseTime);
        }
      }, 10);
    } else {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = undefined;
      }
    }
  }, [startTime, pauseTime, maxTime, paused, limit]);

  useEffect(() => {
    if (limit && limitCall) {
      limitCall();
    }
  }, [limit, limitCall]);

  const startTimer = useCallback(() => {
    if (maxTime <= 0 || !limit) {
      setPaused(false);
      setStartTime(Date.now());
    }
    console.log('Start', time, paused, limit);
  }, [maxTime, limit, paused]);

  const pauseTimer = useCallback(() => {
    setPaused(true);
    setStartTime(0);
    const currTime = Date.now() - startTime + pauseTime;
    if (maxTime <= 0 || (!limit && maxTime > currTime)) {
      setPauseTime(Date.now() - startTime + pauseTime);
    } else {
      setTime(maxTime);
      setLimit(true);
    }
  }, [limit, maxTime, pauseTime, startTime]);

  const resetTimer = useCallback((newLimit = 0, newFunc = null) => {
    setTime(0);
    if (newLimit > 0) setMaxTime(newLimit);
    setStartTime(0);
    setPaused(true);
    setLimit(false);
    if (newFunc) {
      setLimitCall(() => newFunc);
    }
    setPauseTime(0);
    console.log('Reset', time, paused, limit);
  }, []);

  return {
    time,
    running: !paused,
    limit,
    startTimer,
    pauseTimer,
    setTime,
    resetTimer,
    maxTime,
  };
};*/
