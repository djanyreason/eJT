import { Text } from 'react-native';

import { formatTime } from '../../util';

const Display = ({ style, countdown, limit, time }) => {
  return (
    <Text style={style}>{formatTime(countdown ? limit - time : time)}</Text>
  );
};

export default Display;
