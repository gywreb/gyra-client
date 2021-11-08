import { Avatar } from '@chakra-ui/avatar';
import Icon from '@chakra-ui/icon';
import { Box, Flex, Text } from '@chakra-ui/layout';
import React from 'react';
import { PRIORITY_UI, TASK_TYPES_UI } from 'src/configs/constants';
import { BaseStyles } from 'src/configs/styles';

const TaskCard = ({ taskProvided, task, onClick }) => {
  const draggableProps = taskProvided
    ? {
        ref: taskProvided.innerRef,
        ...taskProvided.draggableProps,
        ...taskProvided.dragHandleProps,
      }
    : {};
  return (
    <Box
      minWidth={BaseStyles.taskWidth}
      minHeight={BaseStyles.taskHeight}
      boxShadow={BaseStyles.shadowConfig}
      bgColor="white"
      borderRadius={4}
      mb={2}
      p={2}
      _hover={{ bgColor: 'orange.50' }}
      _active={{ bgColor: 'orange.100' }}
      transition="all 0.2s"
      onClick={onClick}
      {...draggableProps}
    >
      <Flex justifyContent="space-between">
        <Box maxWidth={'80%'}>
          <Text color="gray.500" mb={1}>
            {task?.task_key}
          </Text>
          <Text maxH={12} mb={2} overflowY="hidden">
            {task?.name}
          </Text>
          <Flex alignItems="center">
            <Flex
              boxSize={5}
              bgColor={TASK_TYPES_UI[task?.type]?.color}
              borderRadius={3}
              alignItems="center"
              justifyContent="center"
              mr={2}
            >
              <Icon
                as={TASK_TYPES_UI[task?.type]?.icon}
                color="white"
                boxSize={3}
              />
            </Flex>
            <Icon
              as={PRIORITY_UI[task?.priority]?.icon}
              color={PRIORITY_UI[task?.priority]?.color}
              boxSize={6}
              mr={1}
            />
          </Flex>
        </Box>
        <Avatar
          cursor="pointer"
          boxSize={10}
          src={`https://avatars.dicebear.com/api/gridy/${task.assignee?.username}.svg`}
          bgColor={'gray.500'}
          padding="2px"
          borderColor="white"
          borderWidth={3}
          onClick={() => {}}
        />
      </Flex>
    </Box>
  );
};

export default TaskCard;
