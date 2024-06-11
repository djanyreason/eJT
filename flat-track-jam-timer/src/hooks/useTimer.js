import { useState, useEffect, useRef } from 'react';

export const useTimer = (limit = 0) => {
  const [time, setTime] = useState(0);
  const [maxTime, setMaxTime] = useState(limit);
  const [startTime, setStartTime] = useState(0);
  const [pauseTime, setPauseTime] = useState(0);
  const [status, setStatus] = useState('Paused');

  const interval = useRef(0);

  useEffect(() => {
    if (startTime > 0 && status === 'Running') {
      interval.current = setInterval(() => {
        const newTime = Date.now() - startTime + pauseTime;
        if (maxTime > 0 && newTime > maxTime) {
          setTime(maxTime);
          setStatus('Limit');
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
  }, [startTime, pauseTime, status, maxTime]);

  const startTimer = () => {
    if (maxTime <= 0 || time < maxTime) {
      setPauseTime(time);
      setStatus('Running');
      setStartTime(Date.now());
    }
  };

  const pauseTimer = () => {
    setStatus('Paused');
    setStartTime(0);
    setPauseTime(time);
  };

  const resetTimer = (newLimit = 0) => {
    setTime(0);
    setMaxTime(newLimit > 0 ? newLimit : maxTime);
    setStartTime(0);
    setStatus('Paused');
    setPauseTime(0);
  };

  return {
    time,
    status,
    startTimer,
    pauseTimer,
    setTime,
    resetTimer,
  };
};
