import { Avatar } from '@chakra-ui/avatar';
import { Button } from '@chakra-ui/button';
import { FormControl, FormErrorMessage } from '@chakra-ui/form-control';
import { Flex, Text } from '@chakra-ui/layout';
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
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { extractKeyFromNameTxt } from 'src/utils/extractKeyFromNameTxt';
import { createProject } from '../../store/project/action';
import GAutoCompletePicker from '../GAutoCompletePicker/GAutoCompletePicker';
import GDatePicker from '../GDatePicker/GDatePicker';
import GTextEditor from '../GTextEditor/GTextEditor';
import GTextInput from '../GTextInput/GTextInput';

const Form = chakra('form', {
  baseStyle: {
    width: '100%',
  },
});

const ProjectCreateModal = ({ isOpen, onClose }) => {
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
    description: '',
    begin_date: '',
    end_date: '',
    members: [],
  });

  const { createLoading } = useSelector(state => state.project);
  const [beginDate, setBeginDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);
  const toast = useToast();

  const onCreateProject = data => {
    data.members = data.members.map(mem => mem.value);
    dispatch(createProject(data, toast, closeModalOnSuccess));
  };

  const closeModalOnSuccess = () => {
    onClose();
    reset();
    clearErrors();
  };

  const memberPickerItemRenderer = selected => {
    return (
      <Flex alignItems="center">
        <Avatar
          size="sm"
          src={`https://avatars.dicebear.com/api/gridy/${selected.label}.svg`}
          bgColor="gray.50"
          padding="2px"
          onClick={() => {}}
          mr={2}
          borderColor="orange.700"
          borderWidth={2}
        />
        <Text fontWeight="500">{selected.label}</Text>
        <Text mr={1} ml={1}>
          -
        </Text>
        <Text>{selected.email}</Text>
      </Flex>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        reset();
        clearErrors();
      }}
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Project</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Form>
            <FormControl isInvalid={errors.name}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <GTextInput
                    autoComplete="off"
                    title="Name"
                    isRequired
                    placeholder="Type in your dream project name"
                    onChange={text => {
                      onChange(text);
                      setValue('key', extractKeyFromNameTxt(text.target.value));
                    }}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
                name="name"
                rules={{
                  required: {
                    value: true,
                    message: 'Project name is required',
                  },
                }}
              />
              <FormErrorMessage mb={4}>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.key}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <GTextInput
                    title="Key"
                    isRequired
                    placeholder="Auto generate from your project name"
                    tooltip="Choose a descriptive prefix for your project’s task keys to recognize work from this project."
                    onChange={text =>
                      onChange(
                        text.target.value
                          .trim()
                          .replace(
                            /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
                            ''
                          )
                          .toUpperCase()
                      )
                    }
                    onBlur={onBlur}
                    value={value}
                  />
                )}
                name="key"
                rules={{
                  required: {
                    value: true,
                    message: 'Project key is required',
                  },
                }}
              />
              <FormErrorMessage mb={4}>
                {errors.key && errors.key.message}
              </FormErrorMessage>
            </FormControl>
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
            <FormControl isInvalid={errors.begin_date}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <GDatePicker
                    title="Begin Date"
                    isRequired
                    placeholder="Select the date your project start"
                    maxDate={endDate}
                    onChange={date => {
                      onChange(date);
                      setBeginDate(date);
                    }}
                  />
                )}
                name="begin_date"
                rules={{
                  required: {
                    value: true,
                    message: 'Begin date is required',
                  },
                }}
              />
              <FormErrorMessage mb={4}>
                {errors.begin_date && errors.begin_date.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.end_date}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <GDatePicker
                    title="Estimate End Date"
                    placeholder="Select the estimate date your project will end"
                    onChange={date => {
                      onChange(date);
                      setEndDate(date);
                    }}
                    minDate={beginDate}
                    isDisabled={beginDate ? false : true}
                    tooltip={beginDate ? null : 'Select the begin date first'}
                  />
                )}
                name="end_date"
              />
              <FormErrorMessage mb={4}>
                {errors.end_date && errors.begin_date.end_date}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.members}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <GAutoCompletePicker
                    title="Members"
                    placeholder="Choose members from your team"
                    disableCreateItem
                    itemRenderer={memberPickerItemRenderer}
                    data={userInfo?.team.map(mem => ({
                      value: mem._id,
                      label: mem.username,
                      email: mem.email,
                    }))}
                    key={1}
                    values={value}
                    onSelectedItemsChange={changes =>
                      onChange(changes.selectedItems)
                    }
                  />
                )}
                name="members"
              />
              <FormErrorMessage mb={4}>
                {errors.members && errors.begin_date.members}
              </FormErrorMessage>
            </FormControl>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="orange"
            mr={3}
            type="submit"
            onClick={handleSubmit(onCreateProject)}
            isLoading={createLoading}
          >
            Create Project
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

export default ProjectCreateModal;
