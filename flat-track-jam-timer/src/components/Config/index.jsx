import { View, Text } from 'react-native';
import { useContext, useCallback } from 'react';

import ConfigEntry from './ConfigEntry.jsx';

import ConfigContext from '../../contexts/ConfigContext';

const Config = () => {
  const [config, dispatch] = useContext(ConfigContext);

  const makeSubmit = useCallback(
    (type) => {
      return (min, sec) => {
        dispatch({ type, payload: { time: [parseInt(min), parseInt(sec)] } });
      };
    },
    [dispatch]
  );

  return (
    <View>
      <ConfigEntry
        title='Set Period Time'
        time={config.periodTime}
        submit={makeSubmit('PERIOD')}
      />
      <ConfigEntry
        title='Set Jam Time'
        time={config.jamTime}
        submit={makeSubmit('JAM')}
      />
      <ConfigEntry
        title='Set Lineup Time'
        time={config.lineupTime}
        submit={makeSubmit('LINEUP')}
      />
    </View>
  );
};

export default Config;
