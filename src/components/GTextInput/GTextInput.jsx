import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input';
import {
  Box,
  Text,
  Flex,
  Tooltip,
  Icon,
  Textarea,
  Image,
  Avatar,
} from '@chakra-ui/react';
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
  readOnlyContent,
  leftImg,
  leftImgIsAvatar,
  titleStyle,
  ...restInputProps
}) => {
  return (
    <Box mb={4} {...boxProps}>
      {title && (
        <Flex>
          <Text fontWeight="600" mb={2} ml={1} {...titleStyle}>
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
      {readOnlyContent ? (
        <Flex maxWidth="100%" alignItems="center" ml={1}>
          {leftImg && leftImgIsAvatar ? (
            <Avatar
              size="sm"
              src={leftImg}
              bgColor="orange.50"
              padding="2px"
              borderColor="orange.700"
              borderWidth={2}
              mr={2}
            />
          ) : leftImg ? (
            <Box borderColor="gray.500" borderWidth={2} borderRadius={6} mr={2}>
              <Image
                src={leftImg}
                boxSize={7}
                bgColor="white"
                borderWidth={6}
                borderRadius={6}
              />
            </Box>
          ) : null}
          <Text fontSize="md" color="gray.600">
            {readOnlyContent}
          </Text>
        </Flex>
      ) : (
        <InputGroup maxWidth="100%">
          {isMultiline ? (
            <Textarea
              name={name}
              placeholder={placeholder || null}
              resize={'vertical'}
              focusBorderColor="orange.500"
              _disabled={{ opacity: 1 }}
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
              _disabled={{ opacity: 1 }}
              {...restInputProps}
            />
          )}
        </InputGroup>
      )}
    </Box>
  );
};

export default GTextInput;
