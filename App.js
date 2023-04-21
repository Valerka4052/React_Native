import { useFonts } from 'expo-font';
import { Provider, useSelector } from 'react-redux';
import { store,persistor } from './redux/store';
import { Main } from './Main/Main';
// import { PersistGate } from 'redux-persist/integration/react';

export default function App() {
    const [fontsLoaded] = useFonts({
    'roboto':require('./assets/fonts/Roboto-Medium.ttf')
    });
  if (!fontsLoaded) return null
  return (
    <Provider store={store} >
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <Main />
      {/* </PersistGate> */}
    </Provider>
  );
};

