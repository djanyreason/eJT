import { useState, useEffect, useRef, useCallback } from 'react';

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
  }, [maxTime, limit]);

  const pauseTimer = () => {
    setPaused(true);
    setStartTime(0);
    if (!limit && maxTime > time) {
      setPauseTime(time);
    } else {
      setTime(maxTime);
      setLimit(true);
    }
  };

  const resetTimer = useCallback((newLimit = 0, newFunc = null) => {
    setTime(0);
    if (newLimit > 0) setMaxTime(newLimit);
    setStartTime(0);
    setPaused(true);
    setLimit(false);
    if (newFunc) setLimitCall(() => newFunc);
    setPauseTime(0);
  }, []);

  return {
    time,
    running: !paused,
    limit: limit,
    startTimer,
    pauseTimer,
    setTime,
    resetTimer,
    maxTime,
  };
};
