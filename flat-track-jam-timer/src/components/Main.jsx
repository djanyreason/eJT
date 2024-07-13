import Constants from 'expo-constants';
import { StyleSheet, View } from 'react-native';
import { Route, Routes, Navigate } from 'react-router-native';
import { useEffect } from 'react';

import * as SplashScreen from 'expo-splash-screen';

import { ShareTechMono_400Regular } from '@expo-google-fonts/share-tech-mono';
import { useFonts } from 'expo-font';

import theme from '../theme';
import ControlBar from './ControlBar';
import Timer from './Timer';
import Config from './Config';

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: theme.colors.mainBackground,
  },
});

SplashScreen.preventAutoHideAsync();

const Main = () => {
  const [loaded, error] = useFonts({ ShareTechMono_400Regular });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <View style={styles.container}>
      <ControlBar />
      <Routes>
        <Route path='/config' element={<Config />} />
        <Route path='/' element={<Timer />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </View>
  );
};

export default Main;
