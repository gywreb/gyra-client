import { useOutsideClick } from '@chakra-ui/hooks';
import Icon from '@chakra-ui/icon';
import { Input, InputGroup } from '@chakra-ui/input';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Textarea } from '@chakra-ui/textarea';
import { Tooltip } from '@chakra-ui/tooltip';
import React, { useEffect, useRef, useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';

const GEditable = ({
  title,
  isRequired,
  tooltip,
  boxProps,
  value,
  placeholder,
  isMultiline,
  name,
  onChange,
  textStyle,
  titleStyle,
  editable = true,
  ...restInputProps
}) => {
  const editorRef = useRef();
  const [isShowEditor, setIsShowEditor] = useState(false);

  useOutsideClick({
    ref: editorRef,
    handler: () => setIsShowEditor(false),
  });

  useEffect(() => {
    if (isShowEditor && editorRef.current) {
      editorRef.current.focus();
    }
  }, [isShowEditor, editorRef]);

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
      {!isShowEditor ? (
        <Box
          borderRadius={8}
          transition="all 0.3s"
          _hover={editable ? { backgroundColor: 'gray.100' } : {}}
          onClick={
            editable
              ? () => {
                  setIsShowEditor(true);
                }
              : () => {}
          }
          p={1}
          pl={2}
        >
          <Text color={value ? 'gray.700' : 'gray.500'} {...textStyle}>
            {value || placeholder || 'Short Content'}
          </Text>
        </Box>
      ) : (
        <InputGroup maxWidth="100%">
          {isMultiline ? (
            <Textarea
              name={name}
              placeholder={placeholder || null}
              resize={'vertical'}
              focusBorderColor="orange.500"
              value={value}
              onChange={onChange}
              {...restInputProps}
            />
          ) : (
            <Input
              ref={editorRef}
              name={name}
              variant="outline"
              type="text"
              focusBorderColor="orange.500"
              placeholder={placeholder || null}
              p={4}
              pl={2}
              size="lg"
              value={value}
              onChange={onChange}
              {...textStyle}
              {...restInputProps}
            />
          )}
        </InputGroup>
      )}
    </Box>
  );
};

export default GEditable;
