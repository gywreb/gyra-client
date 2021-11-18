import { Box, Flex, Text } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { BaseStyles } from 'src/configs/styles';
import QueryString from 'query-string';
import { Image } from '@chakra-ui/image';
import LogoBanner from '../../assets/images/gyra-banner-logo-3-trans.png';
import { Button } from '@chakra-ui/button';
import { useToast } from '@chakra-ui/toast';
import { useDispatch } from 'react-redux';
import {
  getCurrent,
  GET_CURRENT_SUCCESS,
  LOGOUT,
} from 'src/store/auth/actions';
import { apiClient, AUTH_API, USER_API } from 'src/configs/api';
import { SET_CURRENT_ACTIVE } from 'src/store/navigation/action';
import { NAVIGATION_KEY } from 'src/configs/navigation';
import { ROUTE_KEY } from 'src/configs/router';
import { formatErrorMessage } from 'src/utils/formatErrorMessage';
import GOverlaySpinner from 'src/components/GOverlaySpinner/GOverlaySpinner';

const Invitation = () => {
  const location = useLocation();
  const history = useHistory();
  const toast = useToast();
  const dispatch = useDispatch();
  const { sender, receiver } = QueryString.parse(location.search);
  const token = localStorage.getItem('jwt');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isGetCurrent, setIsGetCurrent] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (token) {
      handleGetCurrentUser(token);
    }
  }, []);

  const handleGetCurrentUser = async token => {
    setIsGetCurrent(true);
    try {
      const {
        data: {
          data: { userInfo },
        },
      } = await apiClient.get(AUTH_API.getCurrent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsGetCurrent(false);
      if (userInfo._id === receiver) {
        setIsAuth(true);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('jwt', token);
        dispatch({ type: GET_CURRENT_SUCCESS, payload: { userInfo, token } });
        dispatch({
          type: SET_CURRENT_ACTIVE,
          payload: { currentActive: NAVIGATION_KEY.PROJECT },
        });
      } else {
        setIsAuth(false);
        delete apiClient.defaults.headers.common['Authorization'];
        localStorage.removeItem('jwt');
      }
    } catch (error) {
      setIsGetCurrent(false);
      setIsAuth(false);
      console.log(`error`, error);
      delete apiClient.defaults.headers.common['Authorization'];
      localStorage.removeItem('jwt');
    }
  };

  const handleConfirmInvitation = async () => {
    setIsConfirming(true);
    try {
      if (!sender || !receiver) return;
      const {
        data: {
          data: { receiverUser },
        },
      } = await apiClient.post(USER_API.confirmInvitation, {
        sender,
        receiver,
      });
      setIsConfirming(false);
      isAuth
        ? history.push(ROUTE_KEY.Home)
        : history.push({
            pathname: ROUTE_KEY.Login,
            search: `?username=${receiverUser.username}`,
          });
    } catch (error) {
      console.log(error);
      console.log(error?.response?.data);
      let errorMessage = null;
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        if (typeof message === 'string') errorMessage = message;
        else if (typeof message === 'object')
          errorMessage = formatErrorMessage(message);
      }
      setIsConfirming(false);
      toast({
        title: errorMessage || 'failed to confirm invitation!',
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isGetCurrent) return <GOverlaySpinner />;
  return (
    <Flex
      bgColor="orange.50"
      width="100%"
      height="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <Flex
        borderRadius={10}
        bgColor="white"
        boxShadow={BaseStyles.shadowConfig}
        maxW="800px"
        minHeight="400px"
        flexDir="column"
        alignItems="center"
        padding={8}
      >
        <Image src={LogoBanner} maxWidth={300} />
        <Text
          textAlign="center"
          mt={4}
          fontSize="2xl"
          fontWeight="500"
        >{`Click the button below to verify your confirmination on joining the team`}</Text>
        <Button
          colorScheme="orange"
          type="submit"
          // isFullWidth
          mt={8}
          isLoading={isConfirming}
          onClick={handleConfirmInvitation}
        >
          CONFIRM INVITATION
        </Button>
      </Flex>
    </Flex>
  );
};

export default Invitation;
