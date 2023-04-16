import { useFonts } from 'expo-font';
import { Provider, useSelector } from 'react-redux';
import { store } from './redux/store';
import { Main } from './Main/Main';

export default function App() {
    const [fontsLoaded] = useFonts({
    'roboto':require('./assets/fonts/Roboto-Medium.ttf')
    });
  if (!fontsLoaded) return null
  return (
    <Provider store={store} >
      <Main />
    </Provider>
  );
};

