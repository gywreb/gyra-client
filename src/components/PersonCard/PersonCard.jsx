import { Avatar } from '@chakra-ui/avatar';
import { Button } from '@chakra-ui/button';
import Icon from '@chakra-ui/icon';
import { Box, Flex, Text } from '@chakra-ui/layout';
import React, { useEffect } from 'react';
import { BiMailSend } from 'react-icons/bi';
import { GiEmptyHourglass } from 'react-icons/gi';
import { BaseStyles } from 'src/configs/styles';

const PersonCard = ({ personInfo, handleInvite, isInvited, isInviting }) => {
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
        disabled={isInvited ? true : false}
        variant={isInvited ? 'outline' : 'solid'}
        size="md"
        colorScheme="orange"
        type="submit"
        mt={6}
        onClick={handleInvite}
        width="75%"
        leftIcon={
          <Icon
            as={isInvited ? GiEmptyHourglass : BiMailSend}
            color={isInvited ? 'orange.600' : 'white'}
            boxSize={5}
          />
        }
        isLoading={isInviting}
      >
        {isInvited ? 'WAITING' : 'INVITE'}
      </Button>
    </Flex>
  );
};

export default PersonCard;
