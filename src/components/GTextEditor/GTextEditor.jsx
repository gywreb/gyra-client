import { Button } from '@chakra-ui/button';
import Icon from '@chakra-ui/icon';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { chakra } from '@chakra-ui/system';
import { Tooltip } from '@chakra-ui/tooltip';
import React, { useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextEditor = chakra(ReactQuill, {
  baseStyle: { fontSize: 12 },
});

const EditContent = chakra('div', { baseStyle: {} });

const GTextEditor = ({
  title,
  isRequired,
  tooltip,
  boxProps,
  value,
  onChange,
  onClick,
  emptyValueText,
  isEditable,
  onCancel,
  ...restEditorProps
}) => {
  const modules = {
    syntax: true,
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['code-block'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'code-block',
  ];

  const [isShowEditor, setIsShowEditor] = useState(false);
  const [oldValue, setOldValue] = useState(null);

  return (
    <Box mb={4} {...boxProps} width="100%">
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

      {!isEditable ? (
        <TextEditor
          theme="snow"
          value={value || ''}
          onChange={onChange}
          modules={modules}
          formats={formats}
          noOfLines={3}
          {...restEditorProps}
        />
      ) : isShowEditor ? (
        <Box>
          <TextEditor
            theme="snow"
            value={value || ''}
            onChange={onChange}
            modules={modules}
            formats={formats}
            noOfLines={3}
            {...restEditorProps}
          />
          <Box mt={4}>
            <Button
              colorScheme="orange"
              mr={1}
              type="submit"
              onClick={() => {}}
              // isLoading={postLoading}
            >
              Save
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsShowEditor(false);
                onCancel(oldValue);
                setOldValue(null);
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      ) : null}
      {/* display html markup content */}
      {isShowEditor ? null : value && isEditable ? (
        <Box
          borderRadius={8}
          transition="all 0.3s"
          _hover={{ backgroundColor: 'gray.100' }}
          onClick={() => {
            setIsShowEditor(true);
            setOldValue(value);
          }}
        >
          <div className="ql-snow">
            <div className="ql-editor">
              <EditContent
                dangerouslySetInnerHTML={{
                  __html: value,
                }}
              />
            </div>
          </div>
        </Box>
      ) : !value && isEditable ? (
        <Box
          cursor="pointer"
          p={2}
          pl={4}
          pr={4}
          borderRadius={6}
          transition="all 0.3s"
          backgroundColor="gray.100"
          _hover={{ backgroundColor: 'gray.200' }}
          onClick={() => {
            setIsShowEditor(true);
            setOldValue(value);
          }}
        >
          <Text color="gray.400">
            {emptyValueText || 'Add content here...'}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
};

export default GTextEditor;
