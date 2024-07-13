import { createContext, useReducer } from 'react';

import { msTime } from '../util';

const defaultState = {
  periodTime: msTime([30, 0]),
  jamTime: msTime([2, 0]),
  lineupTime: msTime([0, 30]),
};

const configReducer = (state, action) => {
  switch (action.type) {
    case 'PERIOD':
      return { ...state, periodTime: msTime(action.payload.time) };
    case 'JAM':
      return { ...state, jamTime: msTime(action.payload.time) };
    case 'LINEUP':
      return { ...state, jamTime: msTime(action.payload.time) };
    default:
      return state;
  }
};

const ConfigContext = createContext();

export const ConfigContextProvider = (props) => {
  const [config, configDispatch] = useReducer(configReducer, defaultState);

  return (
    <ConfigContext.Provider value={[config, configDispatch]}>
      {props.children}
    </ConfigContext.Provider>
  );
};

export default ConfigContext;
