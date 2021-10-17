import { Box, Flex } from '@chakra-ui/layout';
import React from 'react';
import HeaderBar from '../HeaderBar/HeaderBar';

const GLayout = ({ children }) => {
  return (
    <Box
      width="100%"
      // bgColor="orange.50"
      alignItems="center"
      overflowY="hidden"
    >
      <HeaderBar />
      <Flex height={70} />
      {children}
    </Box>
  );
};

export default GLayout;
