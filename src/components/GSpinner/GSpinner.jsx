import { Flex } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import React from 'react';

const GSpinner = ({ width, height }) => {
  return (
    <Flex
      height={height || '100vh'}
      width={width || '100vw'}
      alignItems="center"
      justifyContent="center"
    >
      <Spinner color="orange.500" boxSize={32} thickness="6px" />
    </Flex>
  );
};

export default GSpinner;
