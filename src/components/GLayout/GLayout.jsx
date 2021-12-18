import { Box, Flex } from '@chakra-ui/layout';
import React from 'react';
import useWindowDimensions from 'src/hooks/useWindowDimensions';
import GScrollBar from '../GScrollBar/GScrollBar';
import HeaderBar from '../HeaderBar/HeaderBar';
import ProjectSidebar from '../ProjectSidebar/ProjectSidebar';

const GLayout = ({ children, isHasSideBar }) => {
  const { height, width } = useWindowDimensions();
  return (
    <Box
      width="100vw"
      height="100vh"
      // bgColor="orange.50"
      alignItems="center"
      overflowY="scroll"
    >
      <HeaderBar />
      {/* <Flex height={70} /> */}
      {isHasSideBar ? (
        <Flex height={height - 70}>
          <ProjectSidebar />
          {children}
        </Flex>
      ) : (
        children
      )}
    </Box>
  );
};

export default GLayout;
