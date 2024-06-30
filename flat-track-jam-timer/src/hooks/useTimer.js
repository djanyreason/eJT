import { useReducer } from 'react';

const defaultState = {
  startTime: 0,
  pauseTime: 0,
  maxTime: 0,
  paused: true,
  limitTime: 0,
};

const timerReducer = (state, action) => {
  switch (action.type) {
    case timerDispatch.START:
      if (!state.paused || state.limitTime > 0) {
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

  return [timer, dispatch];
};
