import { StyleSheet, Text, Pressable } from 'react-native';
import { Link } from 'react-router-native';

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
    >
      {({ pressed }) => (
        <Link to={route}>
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
        </Link>
      )}
    </Pressable>
  );
};

export default NavButton;
