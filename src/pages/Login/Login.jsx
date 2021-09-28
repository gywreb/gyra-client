import { Image } from '@chakra-ui/image';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/input';
import { Box, Flex, Link, Text } from '@chakra-ui/layout';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BaseStyles } from 'src/configs/styles';
import LogoBanner from '../../assets/images/gyra-banner-logo-3-trans.png';
import { MdEmail, MdLock } from 'react-icons/md';
import { AiFillEyeInvisible } from 'react-icons/ai';
import Icon from '@chakra-ui/icon';
import { FormControl, FormErrorMessage } from '@chakra-ui/form-control';
import { chakra } from '@chakra-ui/system';
import { Button } from '@chakra-ui/button';
import { ROUTE_KEY } from 'src/configs/router';

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

  const onLogin = data => {
    console.log(data);
  };

  return (
    <Flex
      width="100vw"
      height="100vh"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
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
          <Image src={LogoBanner} maxWidth={800} />
          <Text
            fontSize="5xl"
            color="orange.400"
            fontWeight="bold"
            textAlign="center"
            mt={-20}
          >
            Manage your dream project with your dream team
          </Text>
        </Box>
      </Flex>
      <Flex
        width="25%"
        h="100%"
        bgColor="white"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        boxShadow={BaseStyles.shadowConfig}
      >
        <Flex
          pt={10}
          pb={10}
          width="70%"
          bgColor="white"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          boxShadow={BaseStyles.shadowConfig}
          borderRadius={14}
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
                  type="password"
                  placeholder="Password"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  focusBorderColor="orange.400"
                />
                <InputRightElement
                  children={<Icon as={AiFillEyeInvisible} color="orange.700" />}
                />
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
    </Flex>
  );
};

export default Login;
