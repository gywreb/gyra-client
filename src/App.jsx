import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import AppNavigation from './navigation/AppNavigation';
import { Provider } from 'react-redux';
import { persistor, store } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router } from 'react-router-dom';

const App = () => {
  return (
    <ChakraProvider resetCSS>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <AppNavigation />
          </Router>
        </PersistGate>
      </Provider>
    </ChakraProvider>
  );
};

export default App;
