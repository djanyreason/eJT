import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useState, useRef } from 'react';

import { arrayTime, formatDigits } from '../../util';
import theme from '../../theme';

const styles = StyleSheet.create({
  boxStyle: {
    marginTop: theme.layout.appPadding,
    backgroundColor: theme.colors.headerBackground,
    /*    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 0,
    flexShrink: 0,*/
  },
  textStyle: {
    color: theme.colors.defaultFont,
    //    fontSize: 72,
    //    fontFamily: 'ShareTechMono_400Regular',
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
    stateFunc(text); /*text.replace(/[^0-9]/g, ''));*/
  };

  const handlePress = (pressFunc) => {
    minRef.current.blur();
    secRef.current.blur();
    pressFunc();
  };

  return (
    <View style={styles.boxStyle}>
      <Text style={styles.textStyle}>{title}</Text>
      <TextInput
        ref={minRef}
        style={styles.textStyle}
        value={min}
        onChangeText={(text) => handleChange(text, setMin)}
        keyboardType='number-pad'
        maxLength={2}
        onBlur={() => {
          if (min.length < 2) setMin(formatDigits(min));
        }}
      />
      <Text style={styles.textStyle}>:</Text>
      <TextInput
        ref={secRef}
        style={styles.textStyle}
        value={sec}
        onChangeText={(text) => handleChange(text, setSec)}
        keyboardType='number-pad'
        maxLength={2}
        onBlur={() => {
          if (sec.length < 2) setSec(formatDigits(sec));
        }}
      />
      <Pressable onPress={() => handlePress(() => submit(min, sec))}>
        <Text style={styles.textStyle}>Update</Text>
      </Pressable>
      <Pressable onPress={() => handlePress(resetForm)}>
        <Text style={styles.textStyle}>Reset</Text>
      </Pressable>
    </View>
  );
};

export default ConfigEntry;
