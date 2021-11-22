import { Image } from '@chakra-ui/image';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/input';
import { Box, Flex, Text } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BaseStyles } from 'src/configs/styles';
import LogoBanner from '../../assets/images/gyra-banner-logo-3-trans.png';
import { MdAccountBox, MdLock } from 'react-icons/md';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import Icon from '@chakra-ui/icon';
import { FormControl, FormErrorMessage } from '@chakra-ui/form-control';
import { chakra } from '@chakra-ui/system';
import { Button } from '@chakra-ui/button';
import { ROUTE_KEY } from 'src/configs/router';
import { Link, useLocation, useHistory } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import QueryString from 'query-string';
import { login } from 'src/store/auth/action';
import { toast, useToast } from '@chakra-ui/toast';
import MotionDiv from 'src/components/MotionDiv/MotionDiv';

const Form = chakra('form', {
  baseStyle: {
    width: '100%',
  },
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const handleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const toast = useToast();
  const { loading } = useSelector(state => state.auth);

  useEffect(() => {
    console.log(location?.search);
    if (location && location?.search) {
      const { username } = QueryString.parse(location.search);
      console.log(username);
      if (username) setValue('username', username);
    }
    return () => {
      location.search = null;
      reset();
    };
  }, [location.search]);

  const onLogin = data => {
    dispatch(login(data, history, toast, reset));
  };

  return (
    <Flex
      width="100vw"
      height="100vh"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      bgColor="orange.50"
    >
      <Flex
        width="70%"
        height="100%"
        bgColor="orange.50"
        flexGrow={1}
        justifyContent="center"
        alignItems="center"
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Image src={LogoBanner} maxWidth={500} />
          <Text
            fontSize={'4xl'}
            color="orange.400"
            fontWeight="bold"
            textAlign="center"
            mt={-10}
          >
            Manage your dream project with your dream team
          </Text>
        </Box>
      </Flex>
      <MotionDiv
        motion="slideRightIn"
        width="30%"
        h="100%"
        boxShadow={BaseStyles.shadowConfig}
      >
        <Flex
          h="100%"
          bgColor="white"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Flex
            pt={10}
            pb={10}
            width="100%"
            bgColor="white"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            maxWidth={500}
            //boxShadow={BaseStyles.shadowConfig}
            //borderRadius={14}
          >
            <Box pl={8} pr={8} mb={4}>
              <Text
                fontSize="xl"
                color="orange.400"
                fontWeight="bold"
                textAlign="center"
              >
                Log in to your account
              </Text>
            </Box>
            <Form onSubmit={handleSubmit(onLogin)} pl={8} pr={8}>
              <FormControl isInvalid={errors.username}>
                <InputGroup size="lg" mt={4}>
                  <InputLeftElement
                    children={<Icon as={MdAccountBox} color="orange.700" />}
                  />
                  <Input
                    autoComplete="off"
                    variant="filled"
                    id="username"
                    placeholder="Username or email"
                    {...register('username', {
                      required: 'Username or email is required',
                    })}
                    focusBorderColor="orange.400"
                  />
                </InputGroup>
                <FormErrorMessage mb={4}>
                  {errors.username && errors.username.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.password}>
                <InputGroup size="lg" mt={4}>
                  <InputLeftElement
                    children={<Icon as={MdLock} color="orange.700" />}
                  />
                  <Input
                    variant="filled"
                    id="password"
                    type={isShowPassword ? 'text' : 'password'}
                    placeholder="Password"
                    {...register('password', {
                      required: 'Password is required',
                    })}
                    focusBorderColor="orange.400"
                  />
                  <InputRightElement>
                    <Button onClick={handleShowPassword}>
                      {isShowPassword ? (
                        <Icon as={AiFillEyeInvisible} color="orange.700" />
                      ) : (
                        <Icon as={AiFillEye} color="orange.700" />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
              <Button
                size="lg"
                colorScheme="orange"
                type="submit"
                isFullWidth
                mt={8}
                isLoading={loading}
              >
                SIGN-IN
              </Button>
              <Flex mt={4} alignItems="center" justifyContent="center">
                <Link to={ROUTE_KEY.Register}>
                  <Text pl={2} color="orange.400">
                    Sign up for an account
                  </Text>
                </Link>
              </Flex>
            </Form>
          </Flex>
        </Flex>
      </MotionDiv>
    </Flex>
  );
};

export default Login;
