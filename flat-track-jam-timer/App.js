import { StatusBar } from 'expo-status-bar';

import Main from './src/components/Main';
import { ConfigContextProvider } from './src/contexts/ConfigContext';

const App = () => {
  return (
    <>
      <ConfigContextProvider>
        <Main />
      </ConfigContextProvider>
      <StatusBar style='auto' />
    </>
  );
};

export default App;
