import { Pressable, Text } from 'react-native';

const ControlButton = ({ style, onPress, label }) => {
  return (
    <Pressable onPress={(event) => onPress(event)}>
      <Text style={style}>{label}</Text>
    </Pressable>
  );
};

export default ControlButton;
