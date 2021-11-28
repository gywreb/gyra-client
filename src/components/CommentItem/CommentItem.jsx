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
import { format } from 'timeago.js';

const TextEditor = chakra(ReactQuill, {
  baseStyle: { fontSize: 12 },
});

const QuillDiv = chakra('div', {
  baseStyle: {},
});

const EditContent = chakra('div', { baseStyle: {} });

const CommentItem = ({
  creator,
  boxProps,
  value,
  comment,
  onChange,
  onCancel,
  onSave,
  isSaveLoading,
  editable = true,
  ...restEditorProps
}) => {
  const commentStyle = {
    bgColor: 'white',
    borderColor: 'gray.300',
    borderWidth: 1.5,
    _hover: { borderColor: 'gray.600' },
  };

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
      {isShowEditor ? (
        <Flex>
          <Avatar
            size="sm"
            src={`https://avatars.dicebear.com/api/gridy/${creator?.username}.svg`}
            bgColor="orange.50"
            padding="2px"
            borderColor="orange.700"
            borderWidth={2}
            mr={2}
          />
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
                Edit
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
      {isShowEditor ? null : (
        <Flex>
          <Avatar
            size="sm"
            src={`https://avatars.dicebear.com/api/gridy/${creator?.username}.svg`}
            bgColor="orange.50"
            padding="2px"
            borderColor="orange.700"
            borderWidth={2}
            mr={2}
          />
          <Box
            fontSize="14px"
            borderRadius={8}
            transition="all 0.3s"
            pl={-2}
            // onClick={
            //   editable
            //     ? () => {
            //         setIsShowEditor(true);
            //       }
            //     : () => {}
            // }
            mb={2}
          >
            <Flex alignItems="center" ml={1}>
              <Text fontSize="md" fontWeight="600">
                {creator.username}
              </Text>
              <Text fontSize="md" fontWeight="700" ml={2} mr={2}>
                ·
              </Text>
              <Text fontSize="sm" color="gray.600">
                {format(comment?.createdAt)}
              </Text>
            </Flex>
            <QuillDiv className="ql-snow" mt={1}>
              <QuillDiv
                className="ql-editor"
                bgColor="gray.100"
                borderRadius={8}
              >
                <EditContent
                  dangerouslySetInnerHTML={{
                    __html: comment?.content,
                  }}
                />
              </QuillDiv>
            </QuillDiv>
            <Flex
              alignItems="center"
              ml={1}
              mt={2}
              fontWeight="500"
              fontSize="xs"
              color="orange.700"
              cursor="pointer"
            >
              <Text _hover={{ textDecoration: 'underline' }}>Edit</Text>
              <Text fontWeight="700" ml={2} mr={2}>
                ·
              </Text>
              <Text _hover={{ textDecoration: 'underline' }}>Delete</Text>
            </Flex>
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default CommentItem;
