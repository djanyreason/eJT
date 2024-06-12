import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (timeLimit = 0) => {
  const [time, setTime] = useState(0);
  const [maxTime, setMaxTime] = useState(timeLimit);
  const [startTime, setStartTime] = useState(0);
  const [pauseTime, setPauseTime] = useState(0);
  const [paused, setPaused] = useState(true);
  const [limit, setLimit] = useState(false);

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

  const resetTimer = useCallback(
    (newLimit = 0) => {
      setTime(0);
      setMaxTime(newLimit > 0 ? newLimit : maxTime);
      setStartTime(0);
      setPaused(true);
      setLimit(false);
      setPauseTime(0);
    },
    [maxTime]
  );

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
