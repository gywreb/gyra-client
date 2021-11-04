import { Avatar } from '@chakra-ui/avatar';
import Icon from '@chakra-ui/icon';
import { Image } from '@chakra-ui/image';
import { Box, Divider, Flex, Text } from '@chakra-ui/layout';
import React from 'react';
import { BsKanban } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_KEY, sideBarNavItems } from 'src/configs/navigation';
import { ROUTE_KEY } from 'src/configs/router';
import { BaseStyles } from 'src/configs/styles';
import { setCurrentSidebarActive } from 'src/store/navigation/action';

const ProjectSidebar = () => {
  const { currentProject } = useSelector(state => state.project);
  const { currentSidebarActive } = useSelector(state => state.navigation);
  const dispatch = useDispatch();
  const renderNavItems = (item, index) => {
    return (
      <NavLink
        to={`${item.id}/${currentProject?._id}`}
        onClick={() => dispatch(setCurrentSidebarActive(item.id))}
      >
        <Flex
          alignItems="center"
          p={4}
          pt={2}
          pb={2}
          width="100%"
          bgColor={currentSidebarActive === item.id ? 'gray.200' : 'gray.50'}
          borderRadius={6}
          mt={index > 0 ? 4 : 0}
        >
          <Icon
            as={item.icon}
            color={currentSidebarActive === item.id ? 'orange.500' : 'gray.700'}
            boxSize={5}
          />
          <Text
            ml={2}
            color={currentSidebarActive === item.id ? 'orange.500' : 'gray.700'}
            fontWeight="500"
          >
            {item.name || 'Nav Item'}
          </Text>
        </Flex>
      </NavLink>
    );
  };
  return (
    <Flex
      bg="gray.50"
      height="100%"
      width={320}
      borderRightWidth={1}
      //borderColor="orange.200"
      boxShadow={BaseStyles.shadowConfig}
      overflowY="auto"
      css={{
        '&:hover': {
          '&::-webkit-scrollbar': {
            visibility: 'visible',
          },
          '&::-webkit-scrollbar-track': {
            visibility: 'visible',
          },
          '&::-webkit-scrollbar-thumb': {
            visibility: 'visible',
          },
        },
        '&::-webkit-scrollbar': {
          width: '8px',
          visibility: 'hidden',
        },
        '&::-webkit-scrollbar-track': {
          width: '10px',
          visibility: 'hidden',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#A0AEC0',
          borderRadius: '24px',
          visibility: 'hidden',
        },
      }}
    >
      <Box mt={6} pl={4} pr={4} width="100%" bg="gray.50">
        <Flex alignItems="center" width="100%">
          <Box borderColor="gray.500" borderWidth={2} borderRadius={10}>
            <Image
              src={`https://avatars.dicebear.com/api/jdenticon/${currentProject?.key}.svg`}
              boxSize={45}
              bgColor="white"
              borderWidth={10}
              borderRadius={10}
            />
          </Box>
          <Box ml={2}>
            <Text fontSize="lg" color="gray.700" fontWeight="600">
              {currentProject?.name || 'Unknown'}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Key: {currentProject?.key || 'Unknown'}
            </Text>
          </Box>
        </Flex>
        <Box height="1.5px" width="100%" bgColor="gray.300" mt={6} mb={6} />
        {sideBarNavItems.map((item, index) => renderNavItems(item, index))}
      </Box>
    </Flex>
  );
};

export default ProjectSidebar;
