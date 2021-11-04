import { Image } from '@chakra-ui/image';
import { Flex } from '@chakra-ui/layout';
import React from 'react';
import { BaseStyles } from 'src/configs/styles';
import LogoGyraBanner from '../../assets/images/gyra-banner-logo-3-trans.png';
import { Button, IconButton } from '@chakra-ui/button';
import Icon from '@chakra-ui/icon';
import { useSelector } from 'react-redux';
import { Avatar } from '@chakra-ui/avatar';
import { AiFillBell } from 'react-icons/ai';
import { APP_NAVIGATIONS } from '../../configs/navigation';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { setCurrentActive } from '../../store/navigation/action';

const HeaderBar = () => {
  const { userInfo } = useSelector(state => state.auth);
  const { currentActive } = useSelector(state => state.navigation);
  const dispatch = useDispatch();
  const history = useHistory();
  return (
    <Flex
      width="100%"
      height={70}
      backgroundColor="white"
      pl={8}
      pr={8}
      boxShadow={BaseStyles.shadowConfig}
      justifyContent="space-between"
      position="relative"
      zIndex="99"
      // position="fixed"
      // zIndex="99"
    >
      <Flex alignItems="center">
        <Image src={LogoGyraBanner} width={180} />
        <Flex ml={10} alignItems="center" height="100%">
          {APP_NAVIGATIONS.map(navigation => (
            <Button
              height="100%"
              bgColor="white"
              _hover={{ bgColor: 'orange.50' }}
              _focus={{ bgColor: 'orange.50' }}
              _active={{ bgColor: 'orange.50' }}
              as={Button}
              color={
                navigation.id === currentActive ? 'orange.500' : 'gray.600'
              }
              position="relative"
              _before={
                navigation.id === currentActive
                  ? {
                      position: 'absolute',
                      content: "''",
                      height: 1,
                      width: '100%',
                      bottom: 0,
                      bgColor: 'orange.500',
                    }
                  : null
              }
              onClick={() => {
                dispatch(setCurrentActive(navigation.id));
                history.replace(navigation.path);
              }}
            >
              {navigation.title}
            </Button>
          ))}
        </Flex>
      </Flex>
      <Flex alignItems="center">
        <IconButton
          borderRadius="50%"
          bg="gray.100"
          position="relative"
          fontSize="12px"
          fontWeight="bold"
          color="white"
          icon={<Icon as={AiFillBell} color="orange.500" boxSize={8} />}
          boxSize={12}
          _after={{
            content: `'99'`,
            position: 'absolute',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            top: '0',
            left: '65%',
            backgroundColor: 'red.500',
            borderWidth: '1px',
            borderColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
          mr={4}
        />
        <Avatar
          cursor="pointer"
          size="md"
          src={`https://avatars.dicebear.com/api/gridy/${userInfo?.username}.svg`}
          bgColor="gray.100"
          padding="2px"
          onClick={() => {}}
        />
      </Flex>
    </Flex>
  );
};

export default HeaderBar;
