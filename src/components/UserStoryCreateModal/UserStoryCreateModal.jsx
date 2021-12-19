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
import { createUserStory } from 'src/store/userstory/action';
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

const UserStoryCreateModal = ({ isOpen, onClose }) => {
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
    content: '',
    description: '',
  });

  const { currentProject } = useSelector(state => state.project);
  const { lastUserStoryKey, createLoading } = useSelector(
    state => state.userstory
  );
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);
  const toast = useToast();

  const onCreateUserStory = data => {
    if (data) {
      let params = {
        ...data,
        key: `US-${lastUserStoryKey + 1}`,
        projectId: currentProject?._id,
      };
      dispatch(createUserStory(params, toast, closeModalOnSuccess));
    }
  };

  const closeModalOnSuccess = () => {
    onClose();
    reset();
    clearErrors();
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
        <ModalHeader>Create New User Story</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Form>
            <GTextInput
              autoComplete="off"
              title="Key"
              isRequired
              readOnlyContent={`US-${lastUserStoryKey + 1}`}
            />
            <FormControl isInvalid={errors.content}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <GTextInput
                    autoComplete="off"
                    title="Content"
                    isRequired
                    placeholder="As an end-user, I want to..."
                    onChange={text => {
                      onChange(text);
                      setValue('key', extractKeyFromNameTxt(text.target.value));
                    }}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
                name="content"
                rules={{
                  required: {
                    value: true,
                    message: 'Project name is required',
                  },
                }}
                defaultValue={'As a ..., I want to ... so that ...'}
              />
              <FormErrorMessage mb={4}>
                {errors.content && errors.content.message}
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
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="orange"
            mr={3}
            type="submit"
            onClick={handleSubmit(onCreateUserStory)}
            isLoading={createLoading}
          >
            Create User Story
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

export default UserStoryCreateModal;
