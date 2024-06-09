import { useState, useEffect, useRef } from 'react';

export const useTimer = (limit = 0) => {
  const [time, setTime] = useState(0);
  const [maxTime, setMaxTime] = useState(limit >= 0 ? limit : 0);
  const [startTime, setStartTime] = useState(0);
  const [paused, setPaused] = useState(true);
  const [pauseTime, setPauseTime] = useState(0);

  const interval = useRef(0);

  useEffect(() => {
    if (startTime > 0 && !paused) {
      interval.current = setInterval(() => {
        const newTime = Date.now() - startTime + pauseTime;
        if (newTime > maxTime) {
          setTime(maxTime);
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
  }, [startTime, pauseTime, paused, maxTime]);

  const startTimer = () => {
    if (time < maxTime) {
      setPauseTime(time);
      setPaused(false);
      setStartTime(Date.now());
    }
  };

  const pauseTimer = () => {
    setPaused(true);
    setStartTime(0);
    setPauseTime(time);
  };

  const resetTimer = (newLimit = 0) => {
    setTime(0);
    setMaxTime(newLimit > 0 ? newLimit : maxTime);
    setStartTime(0);
    setPaused(true);
    setPauseTime(0);
  };

  return {
    time,
    paused,
    complete: time === maxTime,
    startTimer,
    pauseTimer,
    setTime,
    resetTimer,
  };
};
