import { Box, Flex, Text } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/react';
import GyraLogo from '../../assets/images/gyra-logo-4-trans.png';
import React from 'react';
import MotionDiv from '../MotionDiv/MotionDiv';
import { Route, useHistory, useLocation } from 'react-router';
import { Button } from '@chakra-ui/button';
import { ROUTE_KEY } from 'src/configs/router';
import QueryString from 'query-string';

const G404Page = () => {
  const history = useHistory();
  const location = useLocation();
  const { message, status, description } = QueryString.parse(location.search);
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100vh"
      bgColor="orange.50"
    >
      <MotionDiv
        motion="fadeIn"
        display="flex"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        mb={200}
      >
        <Flex justifyContent="center" alignItems="center" width="100%">
          <Image src={GyraLogo} width={400} />
        </Flex>
        <Text fontSize="8xl" color="orange.500" fontWeight="700">
          {status || '404'}
        </Text>
        <Text fontSize="2xl" textAlign="center" fontWeight="500">
          {message ||
            'Opps! This is the wrong way, let take you to the right place!'}
        </Text>
        {description && (
          <Text fontSize="large" textAlign="center" mt={4}>
            {description || 'Contact your project manager for more infomation'}
          </Text>
        )}
        <Button
          size="lg"
          colorScheme="orange"
          type="submit"
          mt={8}
          onClick={() => history.replace(ROUTE_KEY.Home)}
        >
          TAKE ME
        </Button>
      </MotionDiv>
    </Flex>
  );
};

export default G404Page;
