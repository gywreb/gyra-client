import { Box, Flex } from '@chakra-ui/layout';
import React from 'react';
import HeaderBar from '../HeaderBar/HeaderBar';

const GLayout = ({ children }) => {
  return (
    <Box
      width="100%"
      height="100vh"
      // bgColor="orange.50"
      alignItems="center"
      overflowY="hidden"
    >
      <HeaderBar />
      {children}
    </Box>
  );
};

export default GLayout;
