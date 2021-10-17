import { Flex } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import React from 'react';

const GOverlaySpinner = () => {
  return (
    <Flex
      position="absolute"
      width="100vw"
      height="100vh"
      bg="orange.50"
      zIndex="999"
      alignItems="center"
      justifyContent="center"
    >
      <Spinner color="orange.500" boxSize={32} thickness="6px" />
    </Flex>
  );
};

export default GOverlaySpinner;
