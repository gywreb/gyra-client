import { Box, Flex, Text } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import GLayout from 'src/components/GLayout/GLayout';
import { NAVIGATION_KEY, sideBarNavItems } from 'src/configs/navigation';
import { getActivityList } from 'src/store/activity/action';
import { useHistory, useRouteMatch } from 'react-router';
import {
  setCurrentActive,
  setCurrentSidebarActive,
} from 'src/store/navigation/action';
import GSpinner from 'src/components/GSpinner/GSpinner';
import { Image } from '@chakra-ui/image';
import { chakra } from '@chakra-ui/system';
import moment from 'moment';
import { Button } from '@chakra-ui/button';
import 'react-quill/dist/quill.snow.css';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/breadcrumb';
import { ROUTE_KEY } from 'src/configs/router';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  List,
  ListItem,
  Badge,
  Progress,
} from '@chakra-ui/react';
import { BsFillBookmarkFill, BsSearch } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa';
import UserStoryCreateModal from 'src/components/UserStoryCreateModal/UserStoryCreateModal';
import { getUserStoryList } from 'src/store/userstory/action';
import { getTaskListByProject } from 'src/store/task/action';
import { TASK_FIXED_STATUS_UI, TASK_TYPES_UI } from 'src/configs/constants';

const Span = chakra('span', {
  baseStyle: {},
});

const QuillDiv = chakra('div', {
  baseStyle: {},
});

const EditContent = chakra('div', {
  baseStyle: { fontSize: '14px' },
});

const UserStory = () => {
  const { currentSidebarActive } = useSelector(state => state.navigation);
  const { currentUserStoryList, getLoading } = useSelector(
    state => state.userstory
  );
  const { currentProject } = useSelector(state => state.project);
  const { taskListByProject, getLoading: getTaskLoading } = useSelector(
    state => state.task
  );

  const toast = useToast();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const requestUserStoryData = async projectId => {
    await Promise.all([
      dispatch(getUserStoryList(projectId, toast)),
      dispatch(getTaskListByProject(projectId)),
    ]);
  };

  useEffect(() => {
    dispatch(setCurrentActive(NAVIGATION_KEY.PROJECT));
    dispatch(setCurrentSidebarActive(NAVIGATION_KEY.USERSTORY));
  }, []);

  useEffect(() => {
    if (match && match.params?.projectId) {
      requestUserStoryData(match.params.projectId);
    }
  }, [match]);

  const renderUserStoryItem = item => {
    return (
      <AccordionItem>
        <AccordionButton>
          <Flex justifyContent="space-between" alignItems="center" width="100%">
            <Flex alignItems="center" textAlign="left" flexWrap="wrap">
              <Flex alignItems="center" mr={4}>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  w={6}
                  h={6}
                  bgColor="green.300"
                  borderRadius={4}
                  mr={1}
                >
                  <Icon as={BsFillBookmarkFill} color="white" boxSize={4} />
                </Flex>
                <Text color="gray.500" fontWeight="500">
                  {item.key}
                </Text>
              </Flex>
              <Text>{item.content}</Text>
              <Text
                ml={6}
                fontStyle="italic"
                fontWeight="500"
                color={
                  item.tasks.filter(
                    id =>
                      taskListByProject.find(task => task._id === id).isResolve
                  ).length ===
                  item.tasks.filter(id =>
                    taskListByProject.find(task => task._id === id)
                  ).length
                    ? 'green.500'
                    : 'red.500'
                }
              >
                Tasks Resolved:{' '}
                {
                  item.tasks.filter(
                    id =>
                      taskListByProject.find(task => task._id === id).isResolve
                  ).length
                }
                /
                {
                  item.tasks.filter(id =>
                    taskListByProject.find(task => task._id === id)
                  ).length
                }
              </Text>
            </Flex>

            <AccordionIcon />
          </Flex>
        </AccordionButton>

        <AccordionPanel pb={4}>
          <Flex align="center" mb={4}>
            <Flex alignItems="center">
              <Badge fontSize="sm" colorScheme="gray">
                {TASK_FIXED_STATUS_UI.isWorking.label}:
              </Badge>
              <Text fontWeight="500" ml={1} color="">
                {
                  item.tasks.filter(
                    id =>
                      taskListByProject.find(task => task._id === id).isWorking
                  ).length
                }
              </Text>
            </Flex>
            <Flex alignItems="center" ml={6}>
              <Badge fontSize="sm" colorScheme="blue">
                {TASK_FIXED_STATUS_UI.isDone.label}:
              </Badge>
              <Text fontWeight="500" ml={1} color="">
                {
                  item.tasks.filter(
                    id => taskListByProject.find(task => task._id === id).isDone
                  ).length
                }
              </Text>
            </Flex>
            <Flex alignItems="center" ml={6}>
              <Badge fontSize="sm" colorScheme="green">
                {TASK_FIXED_STATUS_UI.isResolve.label}:
              </Badge>
              <Text fontWeight="500" ml={1} color="">
                {
                  item.tasks.filter(
                    id =>
                      taskListByProject.find(task => task._id === id).isResolve
                  ).length
                }
              </Text>
            </Flex>
            <Flex alignItems="center" ml={6}>
              <Badge fontSize="sm" colorScheme="red">
                {TASK_FIXED_STATUS_UI.isClose.label}:
              </Badge>
              <Text fontWeight="500" ml={1} color="">
                {
                  item.tasks.filter(
                    id =>
                      taskListByProject.find(task => task._id === id).isClose
                  ).length
                }
              </Text>
            </Flex>
          </Flex>
          <Text fontWeight="500" mb={2}>
            Description
          </Text>
          <Box p={1} bgColor="gray.50" borderRadius={6}>
            <div className="ql-snow">
              <div className="ql-editor">
                <EditContent
                  dangerouslySetInnerHTML={{
                    __html: item.description || 'No description was added',
                  }}
                />
              </div>
            </div>
          </Box>
          {item.tasks.length ? (
            <>
              <Text fontWeight="500" mb={2} mt={4}>
                Tasks
              </Text>
              <List>
                {item.tasks
                  .map(id => taskListByProject.find(task => task._id === id))
                  .map((task, index) => (
                    <ListItem
                      borderTopWidth={1.2}
                      pt={2}
                      pb={2}
                      borderBottomWidth={
                        index === item.tasks.length - 1 ? 1.2 : 0
                      }
                    >
                      <Flex alignItems="center" justifyContent="space-between">
                        <Flex alignItems="center">
                          <Flex
                            boxSize={5}
                            bgColor={TASK_TYPES_UI[task.type].color}
                            borderRadius={3}
                            alignItems="center"
                            justifyContent="center"
                            mr={2}
                          >
                            <Icon
                              as={TASK_TYPES_UI[task.type].icon}
                              color="white"
                              boxSize={3}
                            />
                          </Flex>
                          <Text fontSize="md" color="gray.500" fontWeight="500">
                            {task.task_key}
                          </Text>
                          <Text fontSize="md" ml={3}>
                            {task.name}
                          </Text>
                        </Flex>
                        {task.isDone ? (
                          <Badge ml={4} fontSize="sm" colorScheme="blue">
                            {TASK_FIXED_STATUS_UI.isDone.label}
                          </Badge>
                        ) : null}
                        {task.isWorking ? (
                          <Badge ml={4} fontSize="sm" colorScheme="orange">
                            {TASK_FIXED_STATUS_UI.isWorking.label}
                          </Badge>
                        ) : null}
                        {task.isResolve ? (
                          <Badge ml={4} fontSize="sm" colorScheme="green">
                            {TASK_FIXED_STATUS_UI.isResolve.label}
                          </Badge>
                        ) : null}
                        {task.isClose ? (
                          <Badge ml={4} fontSize="sm" colorScheme="red">
                            {TASK_FIXED_STATUS_UI.isClose.label}
                          </Badge>
                        ) : null}
                      </Flex>
                    </ListItem>
                  ))}
              </List>
            </>
          ) : null}
        </AccordionPanel>
      </AccordionItem>
    );
  };

  return (
    <GLayout isHasSideBar>
      {getLoading || getTaskLoading ? (
        <GSpinner />
      ) : (
        <Box
          pl={8}
          pr={8}
          pt={6}
          pb={6}
          width="100%"
          overflowX="hidden"
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
              background: 'rgba(135, 137, 140, .5)',
              borderRadius: '24px',
              visibility: 'hidden',
            },
          }}
        >
          <Breadcrumb mb={2}>
            <BreadcrumbItem color="gray.500">
              <BreadcrumbLink href="#">
                <Link to={ROUTE_KEY.Projects}>Projects</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem color="gray.500">
              <Text>{currentProject?.name || 'Unknown'}</Text>
            </BreadcrumbItem>
            <BreadcrumbItem color="gray.500">
              <Text>{`${currentProject?.key} Board` || 'Board'}</Text>
            </BreadcrumbItem>
          </Breadcrumb>
          <Text fontSize="2xl" fontWeight="600" color="orange.500">
            {sideBarNavItems.find(item => item.id === currentSidebarActive)
              ?.name || 'Board'}
          </Text>
          <Flex alignItems="center" mt={4} justifyContent="space-between">
            <InputGroup mr={4}>
              <Input
                placeholder="Search user stories..."
                variant="outline"
                id="search"
                type="text"
                focusBorderColor="orange.700"
                borderColor="orange.500"
                _hover={{ borderColor: 'orange.500' }}
                p={4}
              />
              <InputRightElement>
                <Button bgColor="white" onClick={() => {}} mr={1} height="90%">
                  <Icon as={BsSearch} color="orange.700" />
                </Button>
              </InputRightElement>
            </InputGroup>
            <Button
              variant="solid"
              colorScheme="orange"
              rightIcon={<Icon as={FaPlus} color="white" />}
              onClick={onOpen}
            >
              Create
            </Button>
          </Flex>
          <Box mt={9} width="100%">
            <Accordion defaultIndex={[0]} allowToggle>
              {currentUserStoryList?.map(us => renderUserStoryItem(us))}
            </Accordion>
          </Box>
        </Box>
      )}
      <UserStoryCreateModal
        isOpen={isOpen}
        onClose={onClose}
        key="create-user-story"
      />
    </GLayout>
  );
};

export default UserStory;
