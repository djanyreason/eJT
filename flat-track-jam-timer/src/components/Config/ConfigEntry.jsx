import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useState, useRef } from 'react';

import { arrayTime, formatDigits } from '../../util';
import theme from '../../theme';

const styles = StyleSheet.create({
  boxStyle: {
    marginTop: theme.layout.appPadding,
    backgroundColor: theme.colors.headerBackground,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRowContainerStyle: {
    display: 'flex',
    flexDirection: 'row',
  },
  clockStyle: {
    color: theme.colors.defaultFont,
    fontFamily: theme.fonts.digits,
    fontSize: 48,
  },
  clockInputStyle: {
    color: theme.colors.headerBackground,
    backgroundColor: theme.colors.defaultFont,
    fontFamily: theme.fonts.digits,
    fontSize: 48,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 52,
  },
  headerTextStyle: {
    color: theme.colors.defaultFont,
    fontFamily: theme.fonts.main,
    fontSize: 32,
  },
  buttonTextStyle: {
    color: theme.colors.defaultFont,
    fontFamily: theme.fonts.main,
    fontSize: 18,
  },
  buttonStyle: {
    alignItems: 'center',
    flexGrow: 1,
    margin: theme.layout.appPadding,
    marginTop: 0,
  },
});

const ConfigEntry = ({ title, time, submit }) => {
  const [initMin, initSec] = arrayTime(time);

  const [min, setMin] = useState(formatDigits(initMin));
  const [sec, setSec] = useState(formatDigits(initSec));

  const minRef = useRef(null);
  const secRef = useRef(null);

  const resetForm = () => {
    setMin(formatDigits(initMin));
    setSec(formatDigits(initSec));
  };

  const handleChange = (text, stateFunc) => {
    stateFunc(text.replace(/[^0-9]/g, ''));
  };

  const handlePress = (pressFunc) => {
    minRef.current.blur();
    secRef.current.blur();
    pressFunc();
  };

  return (
    <View style={styles.boxStyle}>
      <View style={styles.flexRowContainerStyle}>
        <Text style={styles.headerTextStyle}>{title}</Text>
      </View>
      <View style={styles.flexRowContainerStyle}>
        <TextInput
          ref={minRef}
          style={styles.clockInputStyle}
          value={min}
          onChangeText={(text) => handleChange(text, setMin)}
          keyboardType='number-pad'
          maxLength={2}
          onBlur={() => {
            if (min.length < 2) setMin(formatDigits(min));
          }}
        />
        <Text style={styles.clockStyle}>:</Text>
        <TextInput
          ref={secRef}
          style={styles.clockInputStyle}
          value={sec}
          onChangeText={(text) => handleChange(text, setSec)}
          keyboardType='number-pad'
          maxLength={2}
          onBlur={() => {
            if (sec.length < 2) setSec(formatDigits(sec));
          }}
        />
      </View>
      <View style={styles.flexRowContainerStyle}>
        <Pressable
          style={{
            backgroundColor: theme.colors.submitButtonBackground,
            ...styles.buttonStyle,
          }}
          onPress={() => handlePress(() => submit(min, sec))}
        >
          <Text style={styles.buttonTextStyle}>Update</Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: theme.colors.resetButtonBackground,
            ...styles.buttonStyle,
          }}
          onPress={() => handlePress(resetForm)}
        >
          <Text style={styles.buttonTextStyle}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ConfigEntry;
