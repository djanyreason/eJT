import { StatusBar } from 'expo-status-bar';
import { ConfigContextProvider } from './src/contexts/ConfigContext';
import { NativeRouter } from 'react-router-native';

import Main from './src/components/Main';

const App = () => {
  return (
    <>
      <NativeRouter>
        <ConfigContextProvider>
          <Main />
        </ConfigContextProvider>
        <StatusBar style='auto' />
      </NativeRouter>
    </>
  );
};

export default App;
