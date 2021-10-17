import React from 'react';
import Icon from '@chakra-ui/icon';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Tooltip } from '@chakra-ui/tooltip';
import { HiInformationCircle } from 'react-icons/hi';
import { CUIAutoComplete } from 'chakra-ui-autocomplete';

const GAutoCompletePicker = ({
  title,
  isRequired,
  tooltip,
  placeholder,
  boxProps,
  items,
  onSelectedItemsChange,
  values,
  ...restAutoCompleteProps
}) => {
  return (
    <Box mb={4} {...boxProps}>
      {title && (
        <Flex>
          <Text bold mb={2} ml={1}>
            {title}
          </Text>
          {isRequired && (
            <Text bold color="red.500">
              *
            </Text>
          )}
          {tooltip && (
            <Tooltip
              label={tooltip}
              fontSize="md"
              placement="top-start"
              color="orange.700"
              bgColor="orange.50"
            >
              <span>
                <Icon as={HiInformationCircle} ml={1} color="orange.500" />
              </span>
            </Tooltip>
          )}
        </Flex>
      )}
      <CUIAutoComplete
        placeholder={placeholder || 'Type in to select'}
        items={
          items || [
            { value: 'ghana', label: 'Ghana' },
            { value: 'nigeria', label: 'Nigeria' },
            { value: 'kenya', label: 'Kenya' },
            { value: 'southAfrica', label: 'South Africa' },
            { value: 'unitedStates', label: 'United States' },
            { value: 'canada', label: 'Canada' },
            { value: 'germany', label: 'Germany' },
          ]
        }
        tagStyleProps={{
          rounded: 'full',
        }}
        inputStyleProps={{ variant: 'filled', focusBorderColor: 'orange.500' }}
        toggleButtonStyleProps={{
          bgColor: 'orange.500',
          color: 'white',
          _hover: { bgColor: 'orange.500', color: 'white' },
          _active: { bgColor: 'orange.500', color: 'white' },
        }}
        highlightItemBg="orange.50"
        selectedItems={values || []}
        onSelectedItemsChange={onSelectedItemsChange}
        {...restAutoCompleteProps}
      />
    </Box>
  );
};

export default GAutoCompletePicker;
