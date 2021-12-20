import { Avatar, baseStyle } from '@chakra-ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/breadcrumb';
import { Button, IconButton } from '@chakra-ui/button';
import { FormErrorMessage } from '@chakra-ui/form-control';
import Icon from '@chakra-ui/icon';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { chakra } from '@chakra-ui/system';
import { useToast } from '@chakra-ui/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BsFillStarFill, BsPersonPlusFill, BsSearch } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import GLayout from 'src/components/GLayout/GLayout';
import GOverlaySpinner from 'src/components/GOverlaySpinner/GOverlaySpinner';
import GSpinner from 'src/components/GSpinner/GSpinner';
import { NAVIGATION_KEY, sideBarNavItems } from 'src/configs/navigation';
import { ROUTE_KEY } from 'src/configs/router';
import { BaseStyles } from 'src/configs/styles';
import { CgClose } from 'react-icons/cg';
import {
  setCurrentActive,
  setCurrentSidebarActive,
} from 'src/store/navigation/action';
import { getProjectDetail } from 'src/store/project/action';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { createColumn, getColumnList } from 'src/store/column/action';
import GScrollBar from 'src/components/GScrollBar/GScrollBar';
import { useDisclosure } from '@chakra-ui/hooks';
import TaskCreateModal from 'src/components/TaskCreateModal/TaskCreateModal';
import { getTaskListByProject, moveTaskInBoard } from 'src/store/task/action';
import {
  FIXED_COUMN_TYPE,
  PRIORITY_UI,
  TASK_TYPES_UI,
} from 'src/configs/constants';
import TaskCard from 'src/components/TaskCard/TaskCard';
import ColumnCard from 'src/components/ColumnCard/ColumnCard';
import TaskEditModal from 'src/components/TaskEditModal/TaskEditModal';
import { RiShieldStarFill } from 'react-icons/ri';
import { Tooltip } from '@chakra-ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/popover';
import InviteMembersPopup from 'src/components/InviteMembersPopup/InviteMembersPopup';
import FixedColumnCard from 'src/components/FixedColumnCard/FixedColumnCard';
import { getUserStoryList } from 'src/store/userstory/action';

const Form = chakra('form', {
  baseStyle: {
    width: BaseStyles.columnWidth,
  },
});

const fixedColumns = [
  {
    name: 'done'.toUpperCase(),
    bgColor: 'blue.300',
    key: FIXED_COUMN_TYPE.DONE,
  },
  {
    name: 'resolve'.toUpperCase(),
    bgColor: 'green.300',
    key: FIXED_COUMN_TYPE.RESOLVE,
  },
  // {
  //   name: 'close'.toUpperCase(),
  //   bgColor: 'red.300',
  //   key: FIXED_COUMN_TYPE.CLOSE,
  // },
];

const Board = () => {
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [taskEditOpen, setTaskEditOpen] = useState(false);
  const [isShowAddColumn, setIsShowAddColumn] = useState(true);
  const [inviteMembersOpen, setInviteMembersOpen] = useState(false);
  const { isGetProjectDetail, currentProject } = useSelector(
    state => state.project
  );
  const { currentUserStoryList, getLoading: getUserStoryLoading } = useSelector(
    state => state.userstory
  );
  const { currentSidebarActive } = useSelector(state => state.navigation);
  const { userInfo } = useSelector(state => state.auth);
  const { taskListByProject, getLoading: getTaskLoading } = useSelector(
    state => state.task
  );
  const { columnList, getLoading, postLoading } = useSelector(
    state => state.column
  );
  const [selectedTask, setSelectedTask] = useState(null);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm();

  const [currentFilterMember, serCurrentFilterMember] = useState(null);

  const requestBoardData = async (projectId, history, toast) => {
    try {
      await Promise.all([
        dispatch(getProjectDetail(projectId, history, toast)),
        dispatch(getColumnList(projectId)),
        dispatch(getTaskListByProject(projectId)),
        dispatch(getUserStoryList(projectId, toast)),
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(setCurrentActive(NAVIGATION_KEY.PROJECT));
    dispatch(setCurrentSidebarActive(NAVIGATION_KEY.BOARD));
  }, []);

  useEffect(() => {
    if (match && match.params?.projectId) {
      requestBoardData(match.params.projectId, history, toast);
    }
  }, [match]);

  const [addingColumn, setAddingColumn] = useState(false);

  const handleAddColumn = data => {
    const params = {
      project: currentProject?._id,
      name: data.name,
    };
    if (
      data.name.toLowerCase() === 'done' ||
      data.name.toLowerCase() === 'resolve' ||
      data.name.toLowerCase() === 'close'
    )
      return toast({
        title: `Name: ${data.name} is already used!`,
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    else dispatch(createColumn(params, toast, reset));
  };

  const handleMove = (result, provided) => {
    const { source, destination, draggableId, type } = result;
    if (!destination) {
      return;
    }
    // move task
    if (type === 'card') {
      dispatch(
        moveTaskInBoard(
          draggableId,
          {
            fromColumnId: source.droppableId,
            toColumnId: destination.droppableId,
            toIndex: destination.index,
          },
          toast
        )
      );
    }
  };

  return (
    <GLayout isHasSideBar boxProps={{ overflowY: 'hidden' }}>
      {isGetProjectDetail || getUserStoryLoading ? (
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
          <Flex
            width="100%"
            alignItems="center"
            mt={4}
            justifyContent="space-between"
          >
            <Flex alignItems="center">
              <InputGroup width="500">
                <Input
                  variant="outline"
                  id="search"
                  type="text"
                  focusBorderColor="orange.700"
                  borderColor="orange.500"
                  _hover={{ borderColor: 'orange.500' }}
                  p={4}
                />
                <InputRightElement>
                  <Button
                    bgColor="white"
                    onClick={() => {}}
                    mr={1}
                    height="90%"
                  >
                    <Icon as={BsSearch} color="orange.700" />
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Flex alignItems="center" ml={10} mr={6}>
                {!currentProject?.members
                  ? null
                  : currentProject?.manager._id === userInfo._id
                  ? [
                      currentProject?.manager,
                      ...currentProject?.members.filter(
                        mem => mem._id !== userInfo._id
                      ),
                    ]
                      .slice(0, 10)
                      .map((item, index) => (
                        <Tooltip
                          label={item.username}
                          placement="top"
                          color="orange.700"
                          bgColor="orange.50"
                        >
                          <Box
                            position="relative"
                            transition="all .3s"
                            _hover={{
                              transform: 'translate(0, -30%)',
                              zIndex: 99,
                            }}
                            left={`${index * -8}px`}
                            zIndex={
                              currentProject?.members
                                ? [
                                    currentProject?.manager,
                                    ...currentProject?.members,
                                  ].length - index
                                : 99 - index
                            }
                            __css={
                              currentFilterMember?._id === item._id
                                ? {
                                    transform: 'translate(0, -30%)',
                                    zIndex: 99,
                                  }
                                : null
                            }
                            onClick={() => {
                              if (currentFilterMember) {
                                if (currentFilterMember._id !== item._id) {
                                  serCurrentFilterMember(item);
                                } else {
                                  serCurrentFilterMember(null);
                                }
                              } else {
                                serCurrentFilterMember(item);
                              }
                            }}
                          >
                            <Avatar
                              cursor="pointer"
                              size="md"
                              src={`https://avatars.dicebear.com/api/gridy/${item?.username}.svg`}
                              bgColor={'gray.300'}
                              padding="2px"
                              borderColor="white"
                              borderWidth={3}
                              onClick={() => {}}
                              position="relative"
                            />
                            {item._id === currentProject.manager._id ? (
                              <Icon
                                as={BsFillStarFill}
                                position="absolute"
                                right="-1%"
                                top="-2%"
                                color="orange.500"
                              />
                            ) : null}
                          </Box>
                        </Tooltip>
                      ))
                  : [
                      currentProject?.manager,
                      userInfo,
                      ...currentProject?.members.filter(
                        mem => mem._id !== userInfo._id
                      ),
                    ]
                      .slice(0, 10)
                      .map((item, index) => (
                        <Tooltip
                          label={item.username}
                          placement="top"
                          color="orange.700"
                          bgColor="orange.50"
                        >
                          <Box
                            position="relative"
                            transition="all .3s"
                            _hover={{
                              transform: 'translate(0, -30%)',
                              zIndex: 99,
                            }}
                            left={`${index * -8}px`}
                            zIndex={
                              currentProject?.members
                                ? [
                                    currentProject?.manager,
                                    ...currentProject?.members,
                                  ].length - index
                                : 99 - index
                            }
                            __css={
                              currentFilterMember?._id === item._id
                                ? {
                                    transform: 'translate(0, -30%)',
                                    zIndex: 99,
                                  }
                                : null
                            }
                            onClick={() => {
                              if (currentFilterMember) {
                                if (currentFilterMember._id !== item._id) {
                                  serCurrentFilterMember(item);
                                } else {
                                  serCurrentFilterMember(null);
                                }
                              } else {
                                serCurrentFilterMember(item);
                              }
                            }}
                          >
                            <Avatar
                              cursor="pointer"
                              size="md"
                              src={`https://avatars.dicebear.com/api/gridy/${item?.username}.svg`}
                              bgColor={'gray.300'}
                              padding="2px"
                              borderColor="white"
                              borderWidth={3}
                              onClick={() => {}}
                              position="relative"
                            />
                            {item._id === currentProject.manager._id ? (
                              <Icon
                                as={BsFillStarFill}
                                position="absolute"
                                right="-1%"
                                top="-2%"
                                color="orange.500"
                              />
                            ) : null}
                          </Box>
                        </Tooltip>
                      ))}
                {userInfo?._id === currentProject?.manager._id ? (
                  <InviteMembersPopup
                    isOpen={inviteMembersOpen}
                    onOpen={() => setInviteMembersOpen(true)}
                    onClose={() => setInviteMembersOpen(false)}
                    renderPopoverTrigger={() => (
                      <Button
                        variant="solid"
                        onClick={() => {}}
                        leftIcon={
                          <Icon as={BsPersonPlusFill} color="black" size="sm" />
                        }
                      >
                        Add Members
                      </Button>
                    )}
                  />
                ) : null}
              </Flex>
              <Flex alignItems="center">
                <Button
                  variant="solid"
                  colorScheme={
                    currentFilterMember?._id === userInfo._id
                      ? 'orange'
                      : 'gray'
                  }
                  onClick={() => {
                    if (currentFilterMember) {
                      if (currentFilterMember._id !== userInfo._id) {
                        serCurrentFilterMember(userInfo);
                      } else {
                        serCurrentFilterMember(null);
                      }
                    } else {
                      serCurrentFilterMember(userInfo);
                    }
                  }}
                >
                  Only My Tasks
                </Button>
                {currentProject?.manager?._id === userInfo?._id ? (
                  <Button
                    ml={4}
                    variant="solid"
                    onClick={() => setIsShowAddColumn(prev => !prev)}
                    colorScheme={isShowAddColumn ? 'gray' : 'green'}
                  >
                    {isShowAddColumn ? 'Hide Add Column' : 'Show Add Column'}
                  </Button>
                ) : null}
              </Flex>
            </Flex>
            {currentUserStoryList?.length && columnList?.length ? (
              <Button
                variant="solid"
                colorScheme="orange"
                rightIcon={<Icon as={FaPlus} color="white" />}
                onClick={() => onOpen()}
              >
                Create Task
              </Button>
            ) : (
              <Tooltip
                label="Add User Stories and Columns first then you can create task"
                fontSize="md"
                placement="top-start"
                color="orange.700"
                bgColor="orange.50"
              >
                <Button
                  variant="solid"
                  colorScheme="orange"
                  rightIcon={<Icon as={FaPlus} color="white" />}
                  opacity={0.5}
                >
                  Create Task
                </Button>
              </Tooltip>
            )}
          </Flex>
          {getLoading ? (
            <GSpinner width="100%" height={600} />
          ) : (
            <DragDropContext onDragEnd={handleMove}>
              <Droppable
                droppableId="all-columns"
                direction="horizontal"
                type="list"
              >
                {boardProvided => (
                  <Flex
                    mt={8}
                    pb={6}
                    overflowX="auto"
                    minHeight="65%"
                    alignItems="flex-start"
                    ref={boardProvided.innerRef}
                    {...boardProvided.droppableProps}
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
                        background: 'rgba(135, 137, 140, .2)',
                        borderRadius: '24px',
                        visibility: 'hidden',
                      },
                    }}
                  >
                    {columnList.map((column, index) => (
                      <Draggable
                        draggableId={column?._id}
                        index={index}
                        key={column._id}
                        isDragDisabled={
                          // currentProject?.manager._id === userInfo?._id
                          //   ? false
                          //   : true
                          true
                        }
                      >
                        {columnProvided => (
                          <ColumnCard
                            column={column}
                            currentFilterMember={currentFilterMember}
                            columnProvided={columnProvided}
                            getTaskLoading={getTaskLoading}
                            taskListByProject={taskListByProject}
                            userInfo={userInfo}
                            currentProject={currentProject}
                            renderTaskComponent={(
                              taskProvided,
                              task,
                              index
                            ) => (
                              <TaskCard
                                editable={false}
                                index={index}
                                taskProvided={taskProvided}
                                task={task}
                                key={task?._id}
                                onClick={() => {
                                  setSelectedTask(task);
                                  setTaskEditOpen(true);
                                }}
                              />
                            )}
                            key={column._id}
                          />
                        )}
                      </Draggable>
                    ))}
                    {boardProvided.placeholder}

                    {!(
                      currentProject?.manager?._id === userInfo?._id &&
                      isShowAddColumn
                    ) ? null : addingColumn ? (
                      <Form
                        p={4}
                        borderRadius={6}
                        mr={4}
                        bgColor="gray.100"
                        minWidth={BaseStyles.columnWidth}
                      >
                        <Input
                          autoComplete="off"
                          variant="outlined"
                          id="name"
                          placeholder="Type in Column name"
                          {...register('name', {
                            required: 'Name is required',
                          })}
                          focusBorderColor="orange.500"
                        />
                        <FormErrorMessage mb={4}>
                          {errors.name && errors.name.message}
                        </FormErrorMessage>
                        <Flex alignItems="center" mt={4}>
                          <Button
                            variant="solid"
                            colorScheme="orange"
                            onClick={handleSubmit(handleAddColumn)}
                            isLoading={postLoading}
                          >
                            Save
                          </Button>
                          <IconButton
                            ml={2}
                            color="gray.500"
                            icon={<Icon as={CgClose} boxSize={7} />}
                            onClick={() => setAddingColumn(false)}
                          />
                        </Flex>
                      </Form>
                    ) : (
                      <Flex
                        minWidth={BaseStyles.columnWidth}
                        minHeight={BaseStyles.addColumnHeight}
                        p={2}
                        mr={4}
                        bgColor="gray.100"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius={6}
                        cursor="pointer"
                        _hover={{ bgColor: 'gray.200' }}
                        transition="all 0.4s"
                        onClick={() => setAddingColumn(true)}
                      >
                        <Icon as={FaPlus} color="gray.500" />
                        <Text color="gray.500" ml={2} pt={2} pb={2}>
                          Add Column
                        </Text>
                      </Flex>
                    )}
                    {fixedColumns.map(column => (
                      <FixedColumnCard
                        column={{
                          ...column,
                          tasks: taskListByProject?.filter(
                            task => task[column.key]
                          ),
                        }}
                        currentFilterMember={currentFilterMember}
                        getTaskLoading={getTaskLoading}
                        taskListByProject={taskListByProject}
                        renderTaskComponent={(taskProvided, task, index) => (
                          <TaskCard
                            index={index}
                            taskProvided={taskProvided}
                            task={task}
                            key={task?._id}
                            onClick={() => {
                              setSelectedTask(task);
                              setTaskEditOpen(true);
                            }}
                          />
                        )}
                        key={column.key}
                        bgColor={column.bgColor}
                        titleStyle={{ color: 'white', fontWeight: '600' }}
                      />
                    ))}
                    {/* <AddColumnAnchor ref={addColumnAnchorRef} /> */}
                  </Flex>
                )}
              </Droppable>
            </DragDropContext>
          )}
          {/* <Text mt={8} fontSize="lg" fontWeight="500">
            Review & Results
          </Text>
          <Flex
            mt={4}
            pb={6}
            overflowX="auto"
            minHeight="65%"
            alignItems="flex-start"
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
                background: 'rgba(135, 137, 140, .2)',
                borderRadius: '24px',
                visibility: 'hidden',
              },
            }}
          ></Flex> */}
        </Box>
      )}
      <TaskCreateModal
        isOpen={isOpen}
        onClose={onClose}
        key={'task-create-modal'}
      />
      <TaskEditModal
        isOpen={taskEditOpen}
        onClose={() => {
          setTaskEditOpen(false);
          setSelectedTask(null);
        }}
        key={'task-edit-modal'}
        selectedTask={selectedTask}
        unableEdit={
          selectedTask?.isDone ||
          selectedTask?.isResolve ||
          selectedTask?.isClose
        }
        userInfo={userInfo}
      />
    </GLayout>
  );
};

export default Board;
