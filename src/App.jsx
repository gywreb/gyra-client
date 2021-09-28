import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import AppNavigation from './navigation/AppNavigation';

const App = () => {
  return (
    <ChakraProvider resetCSS>
      <AppNavigation />
    </ChakraProvider>
  );
};

export default App;
