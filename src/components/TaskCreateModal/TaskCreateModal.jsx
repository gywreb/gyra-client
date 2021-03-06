import { Avatar } from '@chakra-ui/avatar';
import { Button } from '@chakra-ui/button';
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
import { capitalize } from 'lodash';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { BsFillBookmarkFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import {
  PRIORITY_SELECT,
  PRIORITY_UI,
  TASK_TYPES_UI,
  TASK_TYPE_SELECT,
} from 'src/configs/constants';
import { createTask } from 'src/store/task/action';
import GFormMenu from '../GFormMenu/GFormMenu';
import GTextEditor from '../GTextEditor/GTextEditor';
import GTextInput from '../GTextInput/GTextInput';

const Form = chakra('form', {
  baseStyle: {
    width: '100%',
  },
});

const TaskCreateModal = ({ isOpen, onClose }) => {
  const { currentProject } = useSelector(state => state.project);
  const { userInfo } = useSelector(state => state.auth);
  const { columnList } = useSelector(state => state.column);
  const { postLoading, currentLastTaskKey } = useSelector(state => state.task);
  const { currentUserStoryList } = useSelector(state => state.userstory);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, touchedFields },
    reset,
    setValue,
    clearErrors,
    getValues,
  } = useForm({
    name: '',
    key: '',
    priority: '',
    reporter: '',
    assignee: '',
    status: '',
    type: '',
    description: '',
    userStory: '',
  });

  const dispatch = useDispatch();
  const toast = useToast();

  const [subtasks, setSubtasks] = useState([]);
  const [currentSubTask, setCurrentSubTask] = useState('');

  const onCreateTask = data => {
    let params = { ...data };
    for (let key in data) {
      if (key === 'assignee' || key === 'status' || key === 'userStory') {
        params[key] = data[key]._id;
      }
    }
    params.task_key = `${currentProject?.key}-${currentLastTaskKey + 1}`;
    params.project = currentProject?._id;
    params.subtasks = [...subtasks];
    dispatch(createTask(params, toast, closeModalOnSuccess));
  };

  const closeModalOnSuccess = () => {
    onClose();
    reset();
    clearErrors();
  };

  const handleAddSubTask = () => {
    if (currentSubTask.trim().length) {
      setSubtasks(prev => [
        ...prev,
        {
          id: prev.length + 1,
          content: currentSubTask.trim(),
        },
      ]);
      setCurrentSubTask('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setCurrentSubTask('');
        setSubtasks([]);
        onClose();
        reset();
        clearErrors();
      }}
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Form>
            <GTextInput
              autoComplete="off"
              title="Project"
              isRequired
              readOnlyContent={currentProject?.name}
              leftImg={`https://avatars.dicebear.com/api/jdenticon/${currentProject?.key}.svg`}
            />
            <GTextInput
              autoComplete="off"
              title="Reporter"
              isRequired
              readOnlyContent={userInfo.username}
              leftImg={`https://avatars.dicebear.com/api/gridy/${userInfo?.username}.svg`}
              leftImgIsAvatar
            />
            <GTextInput
              autoComplete="off"
              title="Key"
              isRequired
              readOnlyContent={`${currentProject?.key}-${
                currentLastTaskKey + 1
              }`}
              tooltip={'Identifier of your task for future easy managment'}
            />
            <FormControl isInvalid={errors.userStory}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <GFormMenu
                    isRequired
                    title="User Story"
                    placeholder="Choose the user story for this task"
                    value={value}
                    data={currentUserStoryList}
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
                    onClick={item => onChange(item)}
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
            <FormControl isInvalid={errors.status}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <GFormMenu
                    noIcon
                    isRequired
                    title="Status"
                    placeholder="The column this task will belong to"
                    value={value}
                    data={columnList}
                    itemTextProp="name"
                    valueTextProp="name"
                    noCapOntext
                    onClick={item => onChange(item)}
                    tooltip={'Status is the column this task will belong to'}
                    disabled
                  />
                )}
                name="status"
                defaultValue={{
                  ...columnList[0],
                  name: columnList[0]?.name.toUpperCase(),
                }}
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
            <FormControl isInvalid={errors.name}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <GTextInput
                    autoComplete="off"
                    title="Name"
                    isRequired
                    placeholder="Type in task name"
                    onChange={text => {
                      onChange(text);
                    }}
                    onBlur={onBlur}
                    value={value}
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
            <GTextInput
              autoComplete="off"
              title="Requirements"
              isRequired
              placeholder="Type here to add requirements"
              onChange={text => {
                setCurrentSubTask(text.target.value);
              }}
              value={currentSubTask}
              renderRightButton={() => (
                <Button
                  colorScheme="orange"
                  ml={3}
                  onClick={handleAddSubTask}
                  isLoading={false}
                >
                  Add
                </Button>
              )}
            />
            <Box ml={2}>
              {subtasks.map(st => (
                <Flex alignItems="center" mt={2} mb={2}>
                  <Text fontWeight="bold" mr={2}>
                    {st.id}.
                  </Text>
                  <Text>{st.content}</Text>
                </Flex>
              ))}
            </Box>
            <FormControl isInvalid={errors.description}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <GTextEditor
                    autoComplete="off"
                    title="Description"
                    placeholder="Type in task description"
                    onChange={(content, delta, source, editor) => {
                      onChange(content);
                    }}
                    value={value}
                  />
                )}
                name="description"
                defaultValue=""
              />
              <FormErrorMessage mb={4}>
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.priority}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <GFormMenu
                    isRequired
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
            <FormControl isInvalid={errors.type}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <GFormMenu
                    isRequired
                    title="Type"
                    placeholder="Select this task type"
                    value={value}
                    data={TASK_TYPE_SELECT}
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
                      <Flex alignSelf="flex-start" alignItems="center">
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
                        <Text textAlign="left" fontWeight="normal">
                          {capitalize(selectedItem || '')}
                        </Text>
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
            <FormControl isInvalid={errors.assignee}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <GFormMenu
                    isRequired
                    title="Assignee"
                    placeholder="You will assign this task to..."
                    value={value}
                    data={
                      currentProject
                        ? [currentProject?.manager, ...currentProject?.members]
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
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="orange"
            mr={3}
            type="submit"
            onClick={handleSubmit(onCreateTask)}
            isLoading={postLoading}
          >
            Create Task
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setCurrentSubTask('');
              setSubtasks([]);
              onClose();
              reset();
              clearErrors();
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskCreateModal;
