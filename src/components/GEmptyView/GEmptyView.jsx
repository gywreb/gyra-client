import Icon from '@chakra-ui/icon';
import { Flex, Text } from '@chakra-ui/layout';
import React from 'react';
import { ImDrawer2 } from 'react-icons/im';

const GEmptyView = ({ message, width, height, icon, iconSize }) => {
  return (
    <Flex
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      width={width || '100%'}
      height={height || '100%'}
    >
      <Icon as={icon || ImDrawer2} color="gray.400" boxSize={iconSize || 24} />
      <Text color="gray.400" fontSize="lg" mt={4}>
        {message || 'No Content Here'}
      </Text>
    </Flex>
  );
};

export default GEmptyView;
