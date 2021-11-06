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
import { BsSearch } from 'react-icons/bs';
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
import { PRIORITY_UI, TASK_TYPES_UI } from 'src/configs/constants';
import TaskCard from 'src/components/TaskCard/TaskCard';
import ColumnCard from 'src/components/ColumnCard/ColumnCard';

const Form = chakra('form', {
  baseStyle: {
    width: BaseStyles.columnWidth,
  },
});

const AddColumnAnchor = chakra('div', {
  baseStyle: {
    width: BaseStyles.columnWidth,
  },
});

const Board = () => {
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const addColumnAnchorRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isGetProjectDetail, currentProject } = useSelector(
    state => state.project
  );
  const { currentSidebarActive } = useSelector(state => state.navigation);
  const { userInfo } = useSelector(state => state.auth);
  const { taskListByProject, getLoading: getTaskLoading } = useSelector(
    state => state.task
  );
  const { columnList, getLoading, postLoading } = useSelector(
    state => state.column
  );
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm();

  const requestBoardData = async (projectId, history, toast) => {
    try {
      await Promise.all([
        dispatch(getProjectDetail(projectId, history, toast)),
        dispatch(getColumnList(projectId)),
        dispatch(getTaskListByProject(projectId)),
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
    dispatch(createColumn(params, toast, reset));
  };

  const handleMoveColumn = (result, provided) => {
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
    <GLayout isHasSideBar>
      {isGetProjectDetail ? (
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
              <Flex alignItems="center" ml={10}>
                {[...Array(4).keys()].map((item, index) => (
                  <Avatar
                    cursor="pointer"
                    boxSize={10}
                    src={
                      index === 0
                        ? `https://avatars.dicebear.com/api/gridy/${userInfo?.username}.svg`
                        : null
                    }
                    bgColor={'gray.500'}
                    padding="2px"
                    borderColor="white"
                    borderWidth={3}
                    onClick={() => {}}
                    position="relative"
                    left={`${index * -8}px`}
                    zIndex={index * -1}
                  />
                ))}
              </Flex>
              <Flex alignItems="center">
                <Button variant="solid" onClick={() => {}}>
                  Only My Tasks
                </Button>
                {/* <Button ml={4} variant="solid" onClick={() => {}}>
                  Recently Updated
                </Button> */}
              </Flex>
            </Flex>
            <Button
              variant="solid"
              colorScheme="orange"
              rightIcon={<Icon as={FaPlus} color="white" />}
              onClick={() => onOpen()}
            >
              Create Task
            </Button>
          </Flex>
          {getLoading ? (
            <GSpinner width="100%" height={600} />
          ) : (
            <DragDropContext onDragEnd={handleMoveColumn}>
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
                      >
                        {columnProvided => (
                          <ColumnCard
                            column={column}
                            columnProvided={columnProvided}
                            getTaskLoading={getTaskLoading}
                            taskListByProject={taskListByProject}
                            renderTaskComponent={(taskProvided, task) => (
                              <TaskCard
                                taskProvided={taskProvided}
                                task={task}
                                key={task._id}
                              />
                            )}
                            key={column._id}
                          />
                        )}
                      </Draggable>
                    ))}
                    {boardProvided.placeholder}
                    {addingColumn ? (
                      <Form
                        p={4}
                        borderRadius={6}
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
                    <AddColumnAnchor ref={addColumnAnchorRef} />
                  </Flex>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </Box>
      )}
      <TaskCreateModal
        isOpen={isOpen}
        onClose={onClose}
        key={'task-create-modal'}
      />
    </GLayout>
  );
};

export default Board;
