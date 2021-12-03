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
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { editColumn } from 'src/store/column/action';
import GTextInput from '../GTextInput/GTextInput';

const Form = chakra('form', {
  baseStyle: {
    width: '100%',
  },
});

const ColumnEditPopup = ({
  isOpen,
  onOpen,
  onClose,
  renderPopoverTrigger,
  column,
}) => {
  const formDefaultValue = { name: column?.name || '' };
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, touchedFields },
    reset,
    setValue,
    clearErrors,
    getValues,
  } = useForm({
    ...formDefaultValue,
  });

  const { currentProject } = useSelector(state => state.project);
  const { editLoading } = useSelector(state => state.column);
  const toast = useToast();
  const dispatch = useDispatch();

  const closeModalOnSuccess = () => {
    onClose();
    reset();
    clearErrors();
  };

  useEffect(() => {
    if (column) {
      for (let prop in column) {
        if (prop in formDefaultValue) setValue(prop, column[prop]);
      }
    }
  }, [column]);

  const onEditColumn = data => {
    let updateParams = {};
    updateParams.name = data.name;
    dispatch(
      editColumn(
        column?._id,
        currentProject?._id,
        updateParams,
        toast,
        closeModalOnSuccess
      )
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
          <Button variant="solid" size="sm" width="10px">
            <Icon as={HiOutlineDotsVertical} color="gray.700" boxSize={6} />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent minWidth="200px">
        <PopoverArrow />
        <PopoverHeader p={4} fontWeight="500" alignItems="center">
          Edit column
        </PopoverHeader>
        <PopoverCloseButton />
        <PopoverBody>
          <Form>
            <FormControl isInvalid={errors.name}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <GTextInput
                    title="Column name"
                    autoComplete="off"
                    id="name"
                    placeholder="Type in Column name"
                    focusBorderColor="orange.500"
                    onChange={text => onChange(text)}
                    value={value}
                  />
                )}
                name="name"
                rules={{
                  required: {
                    value: true,
                    message: 'Column name is required',
                  },
                }}
              />
              <FormErrorMessage mb={4}>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
          </Form>
        </PopoverBody>
        <PopoverFooter>
          <Flex justifyContent="flex-end">
            <Button
              colorScheme="orange"
              mr={3}
              type="submit"
              onClick={handleSubmit(onEditColumn)}
              isLoading={editLoading}
            >
              Save
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
      </PopoverContent>
    </Popover>
  );
};

export default ColumnEditPopup;
