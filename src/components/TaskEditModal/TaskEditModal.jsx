import { Avatar } from '@chakra-ui/avatar';
import { Button } from '@chakra-ui/button';
import { Editable, EditableInput, EditablePreview } from '@chakra-ui/editable';
import { FormControl, FormErrorMessage } from '@chakra-ui/form-control';
import Icon from '@chakra-ui/icon';
import { Box, Flex, Text } from '@chakra-ui/layout';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { chakra } from '@chakra-ui/system';
import { useToast } from '@chakra-ui/toast';
import { capitalize, omit, pick } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  COMMENT_PER_PAGE,
  PRIORITY_SELECT,
  PRIORITY_UI,
  TASK_TYPES_UI,
  TASK_TYPE_SELECT,
} from 'src/configs/constants';
import GEditable from '../GEditable/GEditable';
import GFormMenu from '../GFormMenu/GFormMenu';
import GTextEditor from '../GTextEditor/GTextEditor';
import GTextInput from '../GTextInput/GTextInput';
import { format } from 'timeago.js';
import {
  doneTask,
  editTask,
  reopenTask,
  resolveTask,
  toggleSubTaskStatus,
} from 'src/store/task/action';
import { createComment, getCommentList } from 'src/store/comment/action';
import GSpinner from '../GSpinner/GSpinner';
import CommentItem from '../CommentItem/CommentItem';
import GEmptyView from '../GEmptyView/GEmptyView';
import { FaCheckCircle, FaCommentSlash } from 'react-icons/fa';
import { BsFillBookmarkFill } from 'react-icons/bs';

const Form = chakra('form', {
  baseStyle: {
    width: '100%',
  },
});

const TaskEditModal = ({
  isOpen,
  onClose,
  selectedTask,
  unableEdit = false,
}) => {
  const { userInfo } = useSelector(state => state.auth);
  const { currentProject } = useSelector(state => state.project);
  const { columnList } = useSelector(state => state.column);
  const {
    editTaskLoading,
    toggleSubTaskLoading,
    doneTaskLoading,
    resolveTaskLoading,
    reopenTaskLoading,
    taskListByProject,
  } = useSelector(state => state.task);
  const {
    currentCommentList,
    createLoading: addCmtLoading,
    currentTotalComment,
    isLoadMoreComment,
    getLoading,
  } = useSelector(state => state.comment);

  const [page, setPage] = useState(1);
  const [isUpdateWhole, setIsUpdateWhole] = useState(true);
  const [currentTask, setCurrentTask] = useState(selectedTask);
  const [currentToggleSubTask, setCurrentToggleSubTask] = useState(null);

  const formDefaultVal = {
    name: selectedTask?.name || '',
    priority: selectedTask?.priority || '',
    reporter: selectedTask?.reporter || '',
    assignee: selectedTask?.assignee || '',
    status: selectedTask?.status?.name || '',
    type: selectedTask?.type || '',
    description: selectedTask?.description || '',
    userStory: selectedTask?.userStory || '',
    comment: '',
  };
  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
    setValue,
    clearErrors,
  } = useForm({ ...formDefaultVal });

  const dispatch = useDispatch();
  const toast = useToast();

  const onUpdateTask = data => {
    let params = { ...data };
    for (let key in data) {
      if (key === 'assignee' || key === 'status') {
        params[key] = data[key]._id;
      }
    }
    params.managerId = currentProject?.manager?._id;
    params = omit(params, ['comment', 'userStory']);
    dispatch(editTask(selectedTask?._id, params, toast));
  };

  const onSaveDescription = data => {
    setIsUpdateWhole(false);
    let params = pick(data, 'description');
    params.managerId = currentProject?.manager?._id;
    dispatch(editTask(selectedTask?._id, params, toast));
  };

  const onAddComment = data => {
    setIsUpdateWhole(false);
    let params = pick(data, 'comment');
    console.log(`params`, data);
    dispatch(
      createComment(
        selectedTask?._id,
        { content: params.comment },
        toast,
        onResetComment
      )
    );
  };

  const onResetComment = () => {
    setTimeout(() => {
      setValue('comment', '');
    }, 100);
    clearErrors();
  };

  const requestCommentData = (page, isLoadMore) => {
    dispatch(
      getCommentList(
        selectedTask?._id,
        COMMENT_PER_PAGE,
        page,
        toast,
        isLoadMore
      )
    );
  };

  const handleLoadMoreComment = () => {
    requestCommentData(page + 1, true);
    setPage(prev => prev + 1);
  };

  const closeModalOnSuccess = () => {
    onClose();
    reset();
    clearErrors();
    setIsUpdateWhole(true);
  };

  useEffect(() => {
    if (selectedTask) {
      setCurrentTask(selectedTask);
      requestCommentData(1, false);
      for (let key in selectedTask) {
        if (key in formDefaultVal) {
          if (key === 'status') setValue(key, selectedTask[key].name);
          else setValue(key, selectedTask[key]);
        }
      }
    }
  }, [selectedTask]);

  useEffect(() => {
    const task = taskListByProject?.find(t => t._id === selectedTask?._id);
    setCurrentTask({ ...task });
  }, [taskListByProject]);

  useEffect(() => {
    // console.log('isDirty :>> ', isDirty);
  }, [isDirty]);

  const isAbleEdit =
    !unableEdit &&
    (userInfo?._id === selectedTask?.reporter?._id ||
      userInfo?._id === selectedTask?.assignee?._id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        reset();
        clearErrors();
      }}
      size="5xl"
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Form>
            <Flex width="100%" flexWrap="wrap">
              <Box w="65%" maxW="65%">
                <FormControl isInvalid={errors.type} maxWidth="25%">
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value, name } }) => (
                      <GFormMenu
                        ml={-2}
                        title=""
                        placeholder="Select this task type"
                        value={value}
                        data={TASK_TYPE_SELECT}
                        noIcon
                        variant="ghost"
                        size="sm"
                        boxProps={{ mb: 1 }}
                        editable={isAbleEdit ? true : false}
                        renderLeftItemAddon={item => (
                          <Flex
                            boxSize={5}
                            bgColor={item.color}
                            borderRadius={3}
                            alignItems="center"
                            justifyContent="center"
                            mr={2}
                          >
                            <Icon as={item.icon} color="white" boxSize={3} />
                          </Flex>
                        )}
                        renderValue={selectedItem => (
                          <Flex alignItems="center">
                            <Flex
                              boxSize={5}
                              bgColor={TASK_TYPES_UI[selectedItem].color}
                              borderRadius={3}
                              alignItems="center"
                              justifyContent="center"
                              mr={2}
                            >
                              <Icon
                                as={TASK_TYPES_UI[selectedItem].icon}
                                color="white"
                                boxSize={3}
                              />
                            </Flex>
                            <Text fontSize="lg">{selectedTask?.task_key}</Text>
                          </Flex>
                        )}
                        onClick={item => onChange(item.label)}
                      />
                    )}
                    name="type"
                    rules={{
                      required: {
                        value: true,
                        message: 'Type is required',
                      },
                    }}
                  />
                  <FormErrorMessage mb={4}>
                    {errors.type && errors.type.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.name} mb={4}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value, name } }) => (
                      <GEditable
                        boxProps={{ mb: 0, ml: -1 }}
                        autoComplete="off"
                        isRequired
                        value={value}
                        name={name}
                        onChange={value => onChange(value)}
                        placeholder={'Type in task name'}
                        textStyle={{ fontSize: '3xl', fontWeight: '500' }}
                        editable={isAbleEdit ? true : false}
                      />
                    )}
                    name="name"
                    rules={{
                      required: {
                        value: true,
                        message: 'Task name is required',
                      },
                    }}
                  />
                  <FormErrorMessage mb={4}>
                    {errors.name && errors.name.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.userStory}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value, name } }) => (
                      <GFormMenu
                        title="User Story"
                        noIcon
                        variant="ghost"
                        pl={1}
                        placeholder="Choose the user story for this task"
                        value={value}
                        data={[]}
                        itemTextProp="content"
                        renderLeftItemAddon={item => (
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
                              <Icon
                                as={BsFillBookmarkFill}
                                color="white"
                                boxSize={4}
                              />
                            </Flex>
                            <Text color="gray.500" fontWeight="500">
                              {item.key}
                            </Text>
                          </Flex>
                        )}
                        renderValue={selectedItem => (
                          <Flex alignItems="center" textAlign="left">
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
                                <Icon
                                  as={BsFillBookmarkFill}
                                  color="white"
                                  boxSize={4}
                                />
                              </Flex>
                              <Text color="gray.500" fontWeight="500">
                                {selectedItem.key}
                              </Text>
                            </Flex>
                            <Text>{selectedItem.content}</Text>
                          </Flex>
                        )}
                        // onClick={item => onChange(item)}
                        editable={false}
                      />
                    )}
                    name="userStory"
                    rules={{
                      required: {
                        value: true,
                        message: 'User Story is required',
                      },
                    }}
                  />
                  <FormErrorMessage mb={4}>
                    {errors.userStory && errors.userStory.message}
                  </FormErrorMessage>
                </FormControl>
                <Text fontWeight="600" mb={2} ml={1}>
                  Requirements:
                </Text>
                <Box ml={2} mb={4}>
                  {currentTask?.subtasks?.map(st => (
                    <Flex
                      alignItems="center"
                      mt={2}
                      mb={2}
                      justifyContent="space-between"
                    >
                      <Flex alignItems="center">
                        <Text fontWeight="bold" mr={2}>
                          {st.id}.
                        </Text>
                        <Text>{st.content}</Text>
                        {st.isDone ? (
                          <Icon
                            ml={2}
                            as={FaCheckCircle}
                            color="green.400"
                            boxSize={6}
                          />
                        ) : null}
                      </Flex>
                      {selectedTask?.assignee?._id === userInfo?._id &&
                      isAbleEdit ? (
                        selectedTask?.status._id ===
                        currentProject?.columns[0] ? null : (
                          <Flex alignItems="center">
                            <Button
                              colorScheme={st.isDone ? 'yellow' : 'green'}
                              mr={3}
                              isLoading={
                                currentToggleSubTask === st.id &&
                                toggleSubTaskLoading
                              }
                              onClick={() => {
                                setCurrentToggleSubTask(st.id);
                                dispatch(
                                  toggleSubTaskStatus(
                                    selectedTask?._id,
                                    st.id,
                                    toast
                                  )
                                );
                              }}
                            >
                              {st.isDone ? 'Undo' : 'Done'}
                            </Button>
                          </Flex>
                        )
                      ) : null}
                    </Flex>
                  ))}
                </Box>
                <FormControl isInvalid={errors.description}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value, name } }) => (
                      <GTextEditor
                        isEditable
                        autoComplete="off"
                        title="Description"
                        placeholder="Type in task description"
                        onChange={(content, delta, source, editor) => {
                          onChange(content);
                        }}
                        value={value}
                        emptyValueText="Add a description here..."
                        titleStyle={{ fontWeight: '400' }}
                        onSave={handleSubmit(onSaveDescription)}
                        isSaveLoading={editTaskLoading && !isUpdateWhole}
                        editable={isAbleEdit ? true : false}
                      />
                    )}
                    name="description"
                    defaultValue=""
                  />
                  <FormErrorMessage mb={4}>
                    {errors.description && errors.description.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value, name } }) => (
                      <GTextEditor
                        isEditable
                        isCommentType
                        autoComplete="off"
                        title="Comments"
                        placeholder="Type in comment"
                        onChange={(content, delta, source, editor) => {
                          onChange(content);
                        }}
                        value={value}
                        emptyValueText="Add a comment..."
                        onSave={handleSubmit(onAddComment)}
                        isSaveLoading={addCmtLoading && !isUpdateWhole}
                        onCancel={onResetComment}
                      />
                    )}
                    name="comment"
                    defaultValue=""
                  />
                  <FormErrorMessage mb={4}>
                    {errors.comment && errors.comment.message}
                  </FormErrorMessage>
                </FormControl>
                <Box>
                  {getLoading ? (
                    <GSpinner width="100%" height="200px" boxSize={14} />
                  ) : currentCommentList?.length ? (
                    <Box
                      mt={6}
                      overflowY="scroll"
                      maxHeight="500px"
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
                      {currentCommentList?.map(comment => (
                        <CommentItem
                          autoComplete="off"
                          creator={comment.sender}
                          value={comment.content}
                          comment={comment}
                        />
                      ))}
                      {page < currentTotalComment ? (
                        <Flex
                          alignItems="center"
                          justifyContent="center"
                          width="100%"
                        >
                          <Button
                            size="lg"
                            colorScheme="orange"
                            width="90%"
                            onClick={handleLoadMoreComment}
                            isLoading={isLoadMoreComment}
                          >
                            LOAD MORE
                          </Button>
                        </Flex>
                      ) : null}
                    </Box>
                  ) : (
                    <GEmptyView
                      height="200px"
                      width="100%"
                      icon={FaCommentSlash}
                      message="No comments here yet"
                    />
                  )}
                </Box>
              </Box>
              <Box w="30%" ml={8} maxW="30%">
                <Flex alignItems="center" mb={3}>
                  {selectedTask?.assignee?._id === userInfo?._id &&
                  currentTask?.isDone ? (
                    <Button
                      colorScheme="yellow"
                      mr={3}
                      isLoading={reopenTaskLoading}
                      onClick={() =>
                        dispatch(
                          reopenTask(
                            selectedTask?._id,
                            columnList[0]?._id,
                            toast,
                            closeModalOnSuccess
                          )
                        )
                      }
                    >
                      RE-OPEN
                    </Button>
                  ) : selectedTask?.reporter?._id === userInfo?._id &&
                    (currentTask?.isClose || currentTask?.isResolve) ? (
                    <Button
                      colorScheme="yellow"
                      mr={3}
                      isLoading={reopenTaskLoading}
                      onClick={() =>
                        dispatch(
                          reopenTask(
                            selectedTask?._id,
                            columnList[0]?._id,
                            toast,
                            closeModalOnSuccess
                          )
                        )
                      }
                    >
                      RE-OPEN
                    </Button>
                  ) : null}
                  {selectedTask?.assignee?._id === userInfo?._id &&
                  currentTask?.subtasks?.filter(st => st.isDone).length ===
                    currentTask?.subtasks?.length &&
                  selectedTask?.status._id ==
                    columnList[columnList.length - 1]._id &&
                  currentTask?.isWorking ? (
                    <Button
                      colorScheme="blue"
                      mr={3}
                      isLoading={doneTaskLoading}
                      onClick={() =>
                        dispatch(
                          doneTask(
                            selectedTask?._id,
                            toast,
                            closeModalOnSuccess
                          )
                        )
                      }
                    >
                      DONE
                    </Button>
                  ) : null}
                  {selectedTask?.reporter?._id === userInfo?._id &&
                  currentTask?.isDone &&
                  !currentTask?.isClose &&
                  !currentTask?.isResolve ? (
                    <Button
                      colorScheme="green"
                      mr={3}
                      isLoading={resolveTaskLoading}
                      onClick={() =>
                        dispatch(
                          resolveTask(
                            selectedTask?._id,
                            toast,
                            closeModalOnSuccess
                          )
                        )
                      }
                    >
                      RESOLVE
                    </Button>
                  ) : null}
                  {selectedTask?.reporter?._id === userInfo?._id &&
                  !currentTask?.isClose &&
                  !currentTask?.isResolve ? (
                    <Button colorScheme="red" mr={3} onClick={() => {}}>
                      CLOSE
                    </Button>
                  ) : null}
                </Flex>
                <FormControl isInvalid={errors.status}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value, name } }) => (
                      <GFormMenu
                        title="Status"
                        placeholder="The column this task will belong to"
                        value={value}
                        data={columnList}
                        itemTextProp="name"
                        valueTextProp="name"
                        noCapOntext
                        onClick={item => onChange(item)}
                        editable={isAbleEdit ? true : false}
                        // variant={isAbleEdit ? 'solid' : 'ghost'}
                      />
                    )}
                    name="status"
                    defaultValue={columnList[0]}
                    rules={{
                      required: {
                        value: true,
                        message: 'Status is required',
                      },
                    }}
                  />
                  <FormErrorMessage mb={4}>
                    {errors.status && errors.status.message}
                  </FormErrorMessage>
                </FormControl>
                <Box borderRadius={8} borderColor="gray.400" borderWidth={1.5}>
                  <Box
                    borderColor="gray.400"
                    borderBottomWidth={1.5}
                    p={2}
                    pl={3}
                    bgColor="gray.100"
                  >
                    <Text fontWeight="600">Detail</Text>
                  </Box>
                  <Box p={2}>
                    <FormControl isInvalid={errors.priority}>
                      <Controller
                        control={control}
                        render={({
                          field: { onChange, onBlur, value, name },
                        }) => (
                          <GFormMenu
                            noIcon
                            variant="ghost"
                            pl={1}
                            title="Priority"
                            placeholder="Select this task priority"
                            value={value}
                            data={PRIORITY_SELECT}
                            renderLeftItemAddon={item => (
                              <Icon
                                mr={1}
                                as={item.icon}
                                color={item.color}
                                boxSize={6}
                              />
                            )}
                            renderValue={selectedItem => (
                              <Flex alignSelf="flex-start" alignItems="center">
                                <Icon
                                  as={PRIORITY_UI[selectedItem].icon}
                                  color={PRIORITY_UI[selectedItem].color}
                                  boxSize={6}
                                  mr={1}
                                />
                                <Text textAlign="left" fontWeight="normal">
                                  {capitalize(selectedItem || '')}
                                </Text>
                              </Flex>
                            )}
                            onClick={item => onChange(item.label)}
                            editable={isAbleEdit ? true : false}
                          />
                        )}
                        name="priority"
                        rules={{
                          required: {
                            value: true,
                            message: 'Priority is required',
                          },
                        }}
                      />
                      <FormErrorMessage mb={4}>
                        {errors.priority && errors.priority.message}
                      </FormErrorMessage>
                    </FormControl>
                    <GTextInput
                      autoComplete="off"
                      title="Reporter"
                      readOnlyContent={selectedTask?.reporter?.username}
                      leftImg={`https://avatars.dicebear.com/api/gridy/${selectedTask?.reporter?.username}.svg`}
                      leftImgIsAvatar
                    />
                    <FormControl isInvalid={errors.assignee}>
                      <Controller
                        control={control}
                        render={({
                          field: { onChange, onBlur, value, name },
                        }) => (
                          <GFormMenu
                            noIcon
                            variant="ghost"
                            pl={1}
                            title="Assignee"
                            placeholder="You will assign this task to..."
                            value={value}
                            data={
                              currentProject
                                ? [
                                    currentProject?.manager,
                                    ...currentProject?.members,
                                  ]
                                : [userInfo]
                            }
                            itemTextProp="username"
                            noCapOntext
                            renderLeftItemAddon={item => (
                              <Avatar
                                size="sm"
                                src={`https://avatars.dicebear.com/api/gridy/${item?.username}.svg`}
                                bgColor="orange.50"
                                padding="2px"
                                borderColor="orange.700"
                                borderWidth={2}
                                mr={2}
                              />
                            )}
                            renderValue={selectedItem => (
                              <Flex alignSelf="flex-start" alignItems="center">
                                <Avatar
                                  size="sm"
                                  src={`https://avatars.dicebear.com/api/gridy/${selectedItem?.username}.svg`}
                                  bgColor="orange.50"
                                  padding="2px"
                                  borderColor="orange.700"
                                  borderWidth={2}
                                  mr={2}
                                />
                                <Text textAlign="left" fontWeight="normal">
                                  {selectedItem?.username || ''}
                                </Text>
                              </Flex>
                            )}
                            onClick={item => onChange(item)}
                            editable={isAbleEdit ? true : false}
                          />
                        )}
                        name="assignee"
                        defaultValue={userInfo}
                        rules={{
                          required: {
                            value: true,
                            message: 'Assignee is required',
                          },
                        }}
                      />
                      <FormErrorMessage mb={4}>
                        {errors.assignee && errors.assignee.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Box>
                </Box>
                <Box mt={4}>
                  <Text fontSize="xs" color="gray.500" fontWeight="500">
                    {`Created at ${format(selectedTask?.createdAt)}`}
                  </Text>
                  <Text fontSize="xs" color="gray.500" mt={1} fontWeight="500">
                    {`Updated at ${format(selectedTask?.updatedAt)}`}
                  </Text>
                </Box>
              </Box>
            </Flex>
          </Form>
        </ModalBody>
        <ModalFooter>
          {isAbleEdit ? (
            <>
              <Button
                colorScheme="orange"
                mr={3}
                type="submit"
                onClick={handleSubmit(onUpdateTask)}
                isLoading={editTaskLoading && isUpdateWhole}
                disabled={isDirty ? false : true}
              >
                Update
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  onClose();
                  reset();
                  clearErrors();
                }}
              >
                Cancel
              </Button>{' '}
            </>
          ) : null}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskEditModal;
