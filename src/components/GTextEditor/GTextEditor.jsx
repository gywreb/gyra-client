import { Avatar } from '@chakra-ui/avatar';
import { Button } from '@chakra-ui/button';
import { useOutsideClick } from '@chakra-ui/hooks';
import Icon from '@chakra-ui/icon';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { chakra } from '@chakra-ui/system';
import { Tooltip } from '@chakra-ui/tooltip';
import React, { useEffect, useRef, useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useSelector } from 'react-redux';

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
  emptyValueText,
  isEditable,
  onCancel,
  titleStyle,
  isCommentType,
  onSave,
  isSaveLoading,
  editable = true,
  ...restEditorProps
}) => {
  const commentStyle = isCommentType
    ? {
        bgColor: 'white',
        borderColor: 'gray.300',
        borderWidth: 1.5,
        _hover: { borderColor: 'gray.600' },
      }
    : {};

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
  const textEditor = useRef();
  const [isShowEditor, setIsShowEditor] = useState(false);
  const [isOnSave, setIsOnSave] = useState(false);
  const { userInfo } = useSelector(state => state.auth);

  useOutsideClick({
    ref: textEditor,
    handler: () => {
      setIsShowEditor(false);
    },
  });

  useEffect(() => {
    if (isOnSave && !isSaveLoading) {
      setIsShowEditor(false);
      setIsOnSave(false);
    }
  }, [isSaveLoading]);

  return (
    <Box mb={4} {...boxProps} width="100%">
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
        <Flex>
          {isCommentType ? (
            <Avatar
              size="sm"
              src={`https://avatars.dicebear.com/api/gridy/${userInfo?.username}.svg`}
              bgColor="orange.50"
              padding="2px"
              borderColor="orange.700"
              borderWidth={2}
              mr={2}
            />
          ) : null}
          <Box ref={textEditor} width="100%">
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
                onClick={() => {
                  setIsOnSave(true);
                  onSave();
                }}
                isLoading={isSaveLoading}
              >
                Save
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsShowEditor(false);
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Flex>
      ) : null}
      {/* display html markup content */}
      {isShowEditor ? null : value?.length && isEditable ? (
        <Flex>
          {isCommentType ? (
            <Avatar
              size="sm"
              src={`https://avatars.dicebear.com/api/gridy/${userInfo?.username}.svg`}
              bgColor="orange.50"
              padding="2px"
              borderColor="orange.700"
              borderWidth={2}
              mr={2}
            />
          ) : null}
          <Box
            borderRadius={8}
            transition="all 0.3s"
            pl={-2}
            onClick={
              editable
                ? () => {
                    setIsShowEditor(true);
                  }
                : () => {}
            }
            borderWidth={1.2}
            borderColor="gray.300"
            _hover={
              editable
                ? {
                    borderColor: 'gray.500',
                  }
                : {}
            }
            width="100%"
            {...commentStyle}
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
        </Flex>
      ) : !value && isEditable ? (
        <Flex>
          {isCommentType ? (
            <Avatar
              size="sm"
              src={`https://avatars.dicebear.com/api/gridy/${userInfo?.username}.svg`}
              bgColor="orange.50"
              padding="2px"
              borderColor="orange.700"
              borderWidth={2}
              mr={2}
            />
          ) : null}
          <Box
            cursor="text"
            p={2}
            pl={4}
            pr={4}
            borderRadius={6}
            transition="all 0.3s"
            backgroundColor={editable ? 'gray.100' : 'white'}
            _hover={editable ? { backgroundColor: 'gray.200' } : {}}
            onClick={
              editable
                ? () => {
                    setIsShowEditor(true);
                  }
                : () => {}
            }
            width="100%"
            {...commentStyle}
          >
            {editable ? (
              <Text color="gray.400">
                {emptyValueText || 'Add content here...'}
              </Text>
            ) : (
              <Text color="gray.400">No content here yet ...</Text>
            )}
          </Box>
        </Flex>
      ) : null}
    </Box>
  );
};

export default GTextEditor;
