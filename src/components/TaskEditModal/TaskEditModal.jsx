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
import { editTask } from 'src/store/task/action';

const Form = chakra('form', {
  baseStyle: {
    width: '100%',
  },
});

const TaskEditModal = ({ isOpen, onClose, selectedTask }) => {
  const { userInfo } = useSelector(state => state.auth);
  const { currentProject } = useSelector(state => state.project);
  const { columnList } = useSelector(state => state.column);
  const { editTaskLoading } = useSelector(state => state.task);
  const [isUpdateWhole, setIsUpdateWhole] = useState(true);
  const formDefaultVal = {
    name: selectedTask?.name || '',
    priority: selectedTask?.priority || '',
    reporter: selectedTask?.reporter || '',
    assignee: selectedTask?.assignee || '',
    status: selectedTask?.status?.name || '',
    type: selectedTask?.type || '',
    description: selectedTask?.description || '',
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
    params = omit(params, ['comment']);
    dispatch(editTask(selectedTask?._id, params, toast));
  };

  const onSaveDescription = data => {
    setIsUpdateWhole(false);
    let params = pick(data, 'description');
    params.managerId = currentProject?.manager?._id;
    dispatch(editTask(selectedTask?._id, params, toast));
  };

  const closeModalOnSuccess = () => {
    onClose();
    reset();
    clearErrors();
    setIsUpdateWhole(true);
  };

  useEffect(() => {
    if (selectedTask) {
      for (let key in selectedTask) {
        if (key in formDefaultVal) {
          if (key === 'status') setValue(key, selectedTask[key].name);
          else setValue(key, selectedTask[key]);
        }
      }
    }
  }, [selectedTask]);

  useEffect(() => {
    console.log('isDirty :>> ', isDirty);
  }, [isDirty]);

  console.log(`selectedTask`, selectedTask);

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
                        emptyValueText="Add a description here..."
                        titleStyle={{ fontWeight: '400' }}
                        onSave={handleSubmit(onSaveDescription)}
                        isSaveLoading={editTaskLoading && !isUpdateWhole}
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
                        onSave={() => {}}
                      />
                    )}
                    name="comment"
                    defaultValue=""
                  />
                  {/* <FormErrorMessage mb={4}>
                    {errors.description && errors.description.message}
                  </FormErrorMessage> */}
                </FormControl>
              </Box>
              <Box w="30%" ml={8} maxW="30%">
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
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskEditModal;
