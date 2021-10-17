import { Input, InputGroup } from '@chakra-ui/input';
import { Box, Text, Flex, Tooltip, Icon, Textarea } from '@chakra-ui/react';
import React from 'react';
import { HiInformationCircle } from 'react-icons/hi';

const GTextInput = ({
  title,
  isRequired,
  tooltip,
  placeholder,
  isMultiline,
  boxProps,
  name,
  ...restInputProps
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
      <InputGroup maxWidth="100%">
        {isMultiline ? (
          <Textarea
            name={name}
            placeholder={placeholder || null}
            resize={'vertical'}
            focusBorderColor="orange.500"
            {...restInputProps}
          />
        ) : (
          <Input
            name={name}
            variant="filled"
            type="text"
            focusBorderColor="orange.500"
            placeholder={placeholder || null}
            p={4}
            {...restInputProps}
          />
        )}
      </InputGroup>
    </Box>
  );
};

export default GTextInput;
