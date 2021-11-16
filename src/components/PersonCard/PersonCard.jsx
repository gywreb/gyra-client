import { Avatar } from '@chakra-ui/avatar';
import { Button } from '@chakra-ui/button';
import { Box, Flex, Text } from '@chakra-ui/layout';
import React, { useEffect } from 'react';
import { BaseStyles } from 'src/configs/styles';

const PersonCard = ({ personInfo, handleInvite }) => {
  return (
    <Flex
      cursor="pointer"
      boxShadow={BaseStyles.trelloShadow}
      bgColor="white"
      minWidth={BaseStyles.personCardWidth}
      minHeight={BaseStyles.personCardHeight}
      alignItems="center"
      justifyContent="center"
      flexDir="column"
      transition="all .3s"
      _hover={{ boxShadow: BaseStyles.trelloShadowHover }}
      borderRadius={4}
      p={6}
    >
      <Avatar
        size="lg"
        src={`https://avatars.dicebear.com/api/gridy/${
          personInfo?.username || ''
        }.svg`}
        bgColor="orange.100"
        padding="2px"
        onClick={() => {}}
      />
      <Text fontSize="lg" mt={2} fontWeight="500">
        {personInfo?.username}
      </Text>
      <Text fontSize="sm" mt={2} maxWidth="90%">
        {personInfo?.email}
      </Text>
      <Button
        size="md"
        colorScheme="orange"
        type="submit"
        mt={6}
        onClick={handleInvite}
        width="75%"
      >
        INVITE
      </Button>
    </Flex>
  );
};

export default PersonCard;
