import { Text } from 'react-native';

import { formatTime } from '../../util';

import theme from '../../theme';

const Display = ({ style, countdown, limit, time, alert }) => {
  return (
    <Text
      style={
        alert && time % 1000 <= 500
          ? [style, { backgroundColor: theme.colors.alert }]
          : style
      }
    >
      {formatTime(countdown ? limit - time : time)}
    </Text>
  );
};

export default Display;
