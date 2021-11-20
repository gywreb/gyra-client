import { Avatar } from '@chakra-ui/avatar';
import { Button } from '@chakra-ui/button';
import { FormControl, FormErrorMessage } from '@chakra-ui/form-control';
import Icon from '@chakra-ui/icon';
import { Flex, Text } from '@chakra-ui/layout';
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/popover';
import { chakra } from '@chakra-ui/system';
import { useToast } from '@chakra-ui/toast';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { BsPersonPlusFill } from 'react-icons/bs';
import { GoPerson } from 'react-icons/go';
import { useDispatch, useSelector } from 'react-redux';
import { editProject } from 'src/store/project/action';
import GAutoCompletePicker from '../GAutoCompletePicker/GAutoCompletePicker';
import GEmptyView from '../GEmptyView/GEmptyView';

const Form = chakra('form', {
  baseStyle: {
    width: '100%',
  },
});

const InviteMembersForm = ({
  isOpen,
  onOpen,
  onClose,
  renderPopoverTrigger,
}) => {
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
    members: [],
  });

  const { userInfo } = useSelector(state => state.auth);
  const { currentProject, editLoading } = useSelector(state => state.project);
  const toast = useToast();
  const dispatch = useDispatch();

  const closeModalOnSuccess = () => {
    onClose();
    reset();
    clearErrors();
  };

  const onAddMembers = data => {
    let updateParams = {};
    updateParams.members = [
      ...currentProject?.members?.map(mem => mem._id),
      ...data.members.map(mem => mem.value),
    ];
    dispatch(
      editProject(currentProject?._id, updateParams, toast, closeModalOnSuccess)
    );
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
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="bottom-start"
      closeOnBlur={false}
      minWidth="500px"
      direction="rtl"
    >
      <PopoverTrigger>
        {renderPopoverTrigger ? (
          renderPopoverTrigger()
        ) : (
          <Button
            variant="solid"
            onClick={() => {}}
            leftIcon={<Icon as={BsPersonPlusFill} color="black" size="sm" />}
          >
            Invite
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent minWidth="500px">
        <PopoverArrow />
        <PopoverHeader p={4} fontWeight="500" alignItems="center">
          Add your teammates to this project
        </PopoverHeader>
        <PopoverCloseButton />
        <PopoverBody>
          {userInfo?.team.filter(
            mem =>
              !!!currentProject?.members.find(
                currentMem => currentMem._id === mem._id
              )
          )?.length ? (
            <Form>
              <FormControl isInvalid={errors.members}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value, name } }) => (
                    <GAutoCompletePicker
                      title=""
                      placeholder="Search your teammates name..."
                      disableCreateItem
                      itemRenderer={memberPickerItemRenderer}
                      data={userInfo?.team
                        .filter(
                          mem =>
                            !!!currentProject?.members.find(
                              currentMem => currentMem._id === mem._id
                            )
                        )
                        .map(mem => ({
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
                  {errors.members && errors.members.members}
                </FormErrorMessage>
              </FormControl>
            </Form>
          ) : (
            <GEmptyView
              height="200px"
              icon={GoPerson}
              message={`You had invited all your teammates.\nLet go to Person > Invite users to your team!`}
            />
          )}
        </PopoverBody>
        {userInfo?.team.filter(
          mem =>
            !!!currentProject?.members.find(
              currentMem => currentMem._id === mem._id
            )
        )?.length ? (
          <PopoverFooter>
            <Flex justifyContent="flex-end">
              <Button
                colorScheme="orange"
                mr={3}
                type="submit"
                onClick={handleSubmit(onAddMembers)}
                isLoading={editLoading}
              >
                Add
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
            </Flex>
          </PopoverFooter>
        ) : null}
      </PopoverContent>
    </Popover>
  );
};

export default InviteMembersForm;
