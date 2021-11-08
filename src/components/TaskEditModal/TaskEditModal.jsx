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
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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

const TaskEditModal = ({ isOpen, onClose, selectedTask }) => {
  const { currentProject } = useSelector(state => state.project);
  const { userInfo } = useSelector(state => state.auth);
  const { columnList } = useSelector(state => state.column);
  const { postLoading, currentLastTaskKey } = useSelector(state => state.task);
  const formDefaultVal = {
    name: selectedTask?.name || '',
    priority: selectedTask?.priority || '',
    reporter: selectedTask?.reporter || '',
    assignee: selectedTask?.assignee || '',
    status: selectedTask?.status || '',
    type: selectedTask?.type || '',
    description: selectedTask?.description || '',
  };
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
    setValue,
    clearErrors,
    getValues,
    watch,
  } = useForm({ ...formDefaultVal });

  const dispatch = useDispatch();
  const toast = useToast();

  const onCreateTask = data => {
    let params = { ...data };
    for (let key in data) {
      if (key === 'assignee' || key === 'status') {
        params[key] = data[key]._id;
      }
    }
    params.task_key = `${currentProject?.key}-${currentLastTaskKey + 1}`;
    params.project = currentProject?._id;
    dispatch(createTask(params, toast, closeModalOnSuccess));
  };

  const closeModalOnSuccess = () => {
    onClose();
    reset();
    clearErrors();
  };

  useEffect(() => {
    if (selectedTask) {
      for (let key in selectedTask) {
        if (key in formDefaultVal) {
          setValue(key, selectedTask[key]);
        }
      }
    }
  }, [selectedTask]);

  useEffect(() => {
    console.log('isDirty :>> ', isDirty);
  }, [isDirty]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        reset();
        clearErrors();
      }}
      size="5xl"
    >
      <ModalOverlay />
      <Form>
        <ModalContent>
          <ModalHeader>
            <FormControl isInvalid={errors.type} maxWidth="25%">
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <GFormMenu
                    ml={-2}
                    isRequired
                    title=""
                    placeholder="Select this task type"
                    value={value}
                    data={TASK_TYPE_SELECT}
                    noIcon
                    variant="ghost"
                    size="sm"
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
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <GTextInput
              autoComplete="off"
              title="Reporter"
              isRequired
              readOnlyContent={userInfo.username}
              leftImg={`https://avatars.dicebear.com/api/gridy/${userInfo?.username}.svg`}
              leftImgIsAvatar
            />
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
                    onCancel={prevValue => {
                      if (prevValue) setValue('description', prevValue);
                    }}
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

            <FormControl isInvalid={errors.assignee}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <GFormMenu
                    isRequired
                    title="Assignee"
                    placeholder="You will assign this task to..."
                    value={value}
                    data={[userInfo]}
                    itemTextProp="username"
                    noCapOntext
                    renderLeftItemAddon={item => (
                      <Avatar
                        size="sm"
                        src={`https://avatars.dicebear.com/api/gridy/${userInfo?.username}.svg`}
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
            <FormControl isInvalid={errors.status}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <GFormMenu
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
                onClose();
                reset();
                clearErrors();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Form>
    </Modal>
  );
};

export default TaskEditModal;
