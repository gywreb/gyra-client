import { Image } from '@chakra-ui/image';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/input';
import { Box, Flex, Text } from '@chakra-ui/layout';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BaseStyles } from 'src/configs/styles';
import LogoBanner from '../../assets/images/gyra-banner-logo-3-trans.png';
import { MdAccountBox, MdEmail, MdLock } from 'react-icons/md';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import Icon from '@chakra-ui/icon';
import { FormControl, FormErrorMessage } from '@chakra-ui/form-control';
import { chakra } from '@chakra-ui/system';
import { Button } from '@chakra-ui/button';
import { ROUTE_KEY } from 'src/configs/router';
import { Link, useHistory } from 'react-router-dom';
import MotionDiv from 'src/components/MotionDiv/MotionDiv';
import { useDispatch } from 'react-redux';
import { useToast } from '@chakra-ui/toast';
import { registerAccount } from 'src/store/auth/actions';
import { useSelector } from 'react-redux';

const Form = chakra('form', {
  baseStyle: {
    width: '100%',
  },
});

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPass, setIsShowConfirmPass] = useState(false);

  const handleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const handleShowConfirmPassword = () => {
    setIsShowConfirmPass(!isShowConfirmPass);
  };

  const { loading } = useSelector(state => state.auth);
  const toast = useToast();
  const dispatch = useDispatch();
  const history = useHistory();

  const password = useRef({});
  password.current = watch('password', '');

  const onRegister = data => {
    dispatch(registerAccount(data, history, toast, reset));
  };

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  useEffect(() => {}, [errors]);

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
        // width="70%"
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
            bgColor="white"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            maxWidth={500}
            width="100%"
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
                Create your new account
              </Text>
            </Box>
            <Form onSubmit={handleSubmit(onRegister)} pl={8} pr={8}>
              <FormControl isInvalid={errors.username}>
                <InputGroup size="lg" mt={4}>
                  <InputLeftElement
                    children={<Icon as={MdAccountBox} color="orange.700" />}
                  />
                  <Input
                    autoComplete="off"
                    variant="filled"
                    id="username"
                    type="username"
                    placeholder="Username"
                    {...register('username', {
                      required: 'Username is required',
                      minLength: {
                        value: 4,
                        message: 'Username must be atleast 4 characters',
                      },
                    })}
                    focusBorderColor="orange.400"
                  />
                </InputGroup>
                <FormErrorMessage mb={4}>
                  {errors.username && errors.username.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.email}>
                <InputGroup size="lg" mt={4}>
                  <InputLeftElement
                    children={<Icon as={MdEmail} color="orange.700" />}
                  />
                  <Input
                    autoComplete="off"
                    variant="filled"
                    id="email"
                    type="email"
                    placeholder="Email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value:
                          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                        message: 'Invalid email',
                      },
                    })}
                    focusBorderColor="orange.400"
                  />
                </InputGroup>
                <FormErrorMessage mb={4}>
                  {errors.email && errors.email.message}
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
              <FormControl isInvalid={errors.confirmPassword}>
                <InputGroup size="lg" mt={4}>
                  <InputLeftElement
                    children={<Icon as={MdLock} color="orange.700" />}
                  />
                  <Input
                    variant="filled"
                    id="confirmPassword"
                    type={isShowConfirmPass ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    {...register('confirmPassword', {
                      required: 'Confirm Password is required',
                      validate: value =>
                        value === password.current ||
                        'Confirm Password do not match',
                    })}
                    focusBorderColor="orange.400"
                  />
                  <InputRightElement>
                    <Button onClick={handleShowConfirmPassword}>
                      {isShowConfirmPass ? (
                        <Icon as={AiFillEyeInvisible} color="orange.700" />
                      ) : (
                        <Icon as={AiFillEye} color="orange.700" />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.confirmPassword && errors.confirmPassword.message}
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
                SIGN-UP
              </Button>
              <Flex mt={4} alignItems="center" justifyContent="center">
                <Link to={ROUTE_KEY.Home}>
                  <Text pl={2} color="orange.400">
                    Already has an account?
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

export default Register;
