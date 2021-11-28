import { Image } from '@chakra-ui/image';
import { Box, Flex, Text } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';
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
import { CgOptions } from 'react-icons/cg';
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/popover';
import { FaBellSlash, FaChevronRight } from 'react-icons/fa';
import { RiLogoutBoxRFill } from 'react-icons/ri';
import { logout } from 'src/store/auth/action';
import { format } from 'timeago.js';
import GEmptyView from '../GEmptyView/GEmptyView';
import {
  getNotificationList,
  seenAllNoti,
} from 'src/store/notification/action';
import moment from 'moment';
import { NOTI_FETCH_HZ, NOTI_PER_PAGE } from 'src/configs/constants';
import { useToast } from '@chakra-ui/toast';
import GSpinner from '../GSpinner/GSpinner';
import { chakra } from '@chakra-ui/system';

const Span = chakra('span', {
  baseStyle: {},
});

const HeaderBar = () => {
  const { userInfo } = useSelector(state => state.auth);
  const { currentActive } = useSelector(state => state.navigation);
  const {
    notiList,
    totalNotis,
    getLoading: getNotisLoading,
    isLoadMoreNotis,
    lastFetchData,
    seenAllLoading,
    totalUnseen,
  } = useSelector(state => state.notification);
  const dispatch = useDispatch();
  const history = useHistory();
  const toast = useToast();

  const [page, setPage] = useState(1);

  const options = [
    {
      title: 'Logout',
      icon: RiLogoutBoxRFill,
      handler: () => dispatch(logout(history)),
    },
  ];

  const requestingNotiList = (page, isLoadMore) => {
    dispatch(getNotificationList(NOTI_PER_PAGE, page, toast, isLoadMore));
  };

  useEffect(() => {
    requestingNotiList(1, false);
  }, []);

  const handleLoadMoreNotis = () => {
    if (page < totalNotis) {
      requestingNotiList(page + 1, true);
      setPage(prev => prev + 1);
    }
  };

  const renderOptionsMenu = () => {
    return (
      <PopoverContent>
        <PopoverHeader
          fontWeight="semibold"
          transition="all .3s"
          _hover={{ bgColor: 'gray.100' }}
          cursor="pointer"
        >
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center">
              <Avatar
                cursor="pointer"
                size="md"
                src={`https://avatars.dicebear.com/api/gridy/${userInfo?.username}.svg`}
                bgColor="gray.50"
                padding="2px"
                onClick={() => {}}
                mr={2}
                borderColor="orange.700"
                borderWidth={2}
              />
              <Box>
                <Text color="gray.600" fontSize="md">
                  {userInfo?.username}
                </Text>
                <Text color="gray.600" fontSize="md" mt={1} fontWeight="400">
                  {userInfo?.email}
                </Text>
              </Box>
            </Flex>
            <Icon as={FaChevronRight} color="gray.700" size="md" />
          </Flex>
        </PopoverHeader>
        <PopoverArrow />
        <PopoverBody>
          {options.map(item => (
            <Flex
              alignItems="center"
              transition="all .3s"
              _hover={{ bgColor: 'gray.200' }}
              p={2}
              borderRadius={6}
              cursor="pointer"
              onClick={item.handler}
            >
              <Flex
                width="36px"
                height="36px"
                bgColor="gray.100"
                borderRadius="18px"
                p={2}
                mr={2}
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={item.icon} color="orange.500" boxSize={5} />
              </Flex>
              <Text size="md" fontSize="md" color="gray.800">
                {item.title}
              </Text>
            </Flex>
          ))}
        </PopoverBody>
      </PopoverContent>
    );
  };

  const renderNotiList = () => {
    return (
      <PopoverContent minW="500px" position="relative" zIndex="99">
        <PopoverHeader fontWeight="semibold" transition="all .3s">
          <Flex alignItems="center" justifyContent="space-between">
            <Text color="gray.600" fontSize="md">
              Notifications
            </Text>
            <Flex alignItems="center">
              <Text
                color="orange.500"
                fontSize="xs"
                cursor="pointer"
                transition="all .3s"
                _hover={{ color: 'orange.700' }}
                onClick={() => {
                  dispatch(seenAllNoti(toast));
                }}
              >
                Mark Read-All
              </Text>
              {seenAllLoading ? (
                <Box ml={1}>
                  <GSpinner
                    width="20px"
                    height="20px"
                    boxSize={4}
                    thickness="2px"
                  />
                </Box>
              ) : null}
            </Flex>
          </Flex>
        </PopoverHeader>
        <PopoverArrow />
        <PopoverBody maxHeight="500px" overflowY="auto" overflowX="hidden">
          {getNotisLoading ? (
            <GSpinner width="100%" height="200px" boxSize={14} />
          ) : notiList?.length ? (
            notiList?.map((item, index) => (
              <Box
                borderBottomWidth={index === notiList?.length - 1 ? 0 : 1.5}
                borderBottomColor="gray.300"
                _hover={{ bgColor: 'gray.200' }}
                transition="all .3s"
                p={2}
              >
                <Flex borderRadius={6}>
                  <Avatar
                    size="md"
                    src={`https://avatars.dicebear.com/api/gridy/${item?.sender?.username}.svg`}
                    bgColor="gray.50"
                    padding="2px"
                    mr={2}
                    borderColor="orange.700"
                    borderWidth={2}
                  />
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    flexGrow={1}
                  >
                    <Box
                      alignItems="center"
                      onClick={item.handler}
                      maxWidth="85%"
                    >
                      <Text
                        size="md"
                        fontSize="md"
                        color="gray.800"
                        fontWeight={item.seen ? 'normal' : '500'}
                      >
                        <Span fontWeight="600" color="orange.700">
                          {item?.sender?.username}{' '}
                        </Span>
                        {item.content}
                      </Text>
                      <Text fontSize="sm" color="gray.500" fontStyle="italic">
                        {format(item?.createdAt)}
                      </Text>
                    </Box>
                    {item.seen ? null : (
                      <Box
                        width="12px"
                        height="12px"
                        borderRadius="6px"
                        bgColor="orange.500"
                      ></Box>
                    )}
                  </Flex>
                </Flex>
              </Box>
            ))
          ) : (
            <GEmptyView
              height="200px"
              width="100%"
              icon={FaBellSlash}
              message="No notifications here yet"
            />
          )}
          {page < totalNotis ? (
            <Button
              size="sm"
              colorScheme="orange"
              mt={4}
              onClick={handleLoadMoreNotis}
              isFullWidth
              isLoading={isLoadMoreNotis}
            >
              LOAD MORE
            </Button>
          ) : null}
        </PopoverBody>
      </PopoverContent>
    );
  };

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
        <Flex
          alignItems="center"
          transition="all .3s"
          mr={4}
          _hover={{
            bgColor: 'gray.100',
          }}
          p={2}
          borderRadius={30}
          cursor="pointer"
        >
          <Avatar
            cursor="pointer"
            boxSize={10}
            src={`https://avatars.dicebear.com/api/gridy/${userInfo?.username}.svg`}
            bgColor="gray.50"
            padding="2px"
            onClick={() => {}}
            mr={2}
            borderColor="orange.700"
            borderWidth={2}
          />
          <Text color="gray.600" fontSize="md">
            {userInfo?.username}
          </Text>
        </Flex>
        <Popover
          isLazy
          placement="bottom-end"
          onOpen={() => {
            if (
              lastFetchData &&
              moment().diff(moment(lastFetchData), 'minutes') > NOTI_FETCH_HZ
            ) {
              requestingNotiList(1, false);
            }
          }}
        >
          <PopoverTrigger>
            <IconButton
              borderRadius="50%"
              bg="gray.100"
              position="relative"
              fontSize="12px"
              fontWeight="bold"
              color="white"
              icon={<Icon as={AiFillBell} color="orange.500" boxSize={8} />}
              boxSize={12}
              _after={
                totalUnseen
                  ? {
                      content: `'${totalUnseen}'`,
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
                    }
                  : {}
              }
              mr={4}
            />
          </PopoverTrigger>
          {renderNotiList()}
        </Popover>

        <Popover isLazy placement="bottom-start">
          <PopoverTrigger>
            <IconButton
              borderRadius="50%"
              bg="gray.100"
              position="relative"
              fontSize="12px"
              fontWeight="bold"
              color="white"
              icon={<Icon as={CgOptions} color="orange.500" boxSize={8} />}
              boxSize={12}
            />
          </PopoverTrigger>
          {renderOptionsMenu()}
        </Popover>
      </Flex>
    </Flex>
  );
};

export default HeaderBar;
