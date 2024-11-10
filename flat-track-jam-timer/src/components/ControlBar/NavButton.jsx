import { StyleSheet, Text, Pressable } from 'react-native';
import { useNavigate } from 'react-router-native';

import theme from '../../theme';

const styles = StyleSheet.create({
  buttonStyle: {
    padding: theme.layout.appPadding,
    /*    borderWidth: 2,
    borderRightColor: 'white',
    borderTopColor: 'white',
    borderBottomColor: 'grey',
    borderLeftColor: 'grey',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,*/
  },
  textStyle: {
    color: theme.colors.defaultFont,
  },
});

const NavButton = ({ content, route }) => {
  const navigate = useNavigate();

  const handlePress = () => navigate(route);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonStyle,
        {
          backgroundColor: pressed
            ? theme.colors.defaultFont
            : theme.colors.configButtonBackground,
        },
      ]}
      onPress={handlePress}
    >
      {({ pressed }) => (
        <Text
          style={[
            {
              color: pressed
                ? theme.colors.configButtonBackground
                : theme.colors.defaultFont,
            },
          ]}
        >
          {content}
        </Text>
      )}
    </Pressable>
  );
};

export default NavButton;
