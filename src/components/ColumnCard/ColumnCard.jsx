import { Box, Text } from '@chakra-ui/layout';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { BaseStyles } from 'src/configs/styles';
import GSpinner from '../GSpinner/GSpinner';
import TaskCard from '../TaskCard/TaskCard';

const ColumnCard = ({
  columnProvided,
  column,
  getTaskLoading,
  taskListByProject,
  renderTaskComponent,
  currentFilterMember,
  userInfo,
}) => {
  const draggableProps = columnProvided
    ? {
        ref: columnProvided.innerRef,
        ...columnProvided.draggableProps,
        ...columnProvided.dragHandleProps,
      }
    : {};
  return (
    <Box
      minWidth={BaseStyles.columnWidth}
      minHeight={BaseStyles.addColumnHeight}
      p={2}
      mr={4}
      bgColor="gray.100"
      borderRadius={6}
      cursor="pointer"
      _hover={{ bgColor: 'gray.200' }}
      transition="all 0.4s"
      {...draggableProps}
    >
      <Text color="gray.600" ml={2}>
        {column?.name || ''}
      </Text>
      <Droppable droppableId={column?._id} direction="vertical" type="card">
        {dropColumnProvided => (
          <Box
            mt={4}
            ref={dropColumnProvided.innerRef}
            {...dropColumnProvided.droppableProps}
            css={{
              '&:hover': {
                '&::-webkit-scrollbar': {
                  visibility: 'visible',
                },
                '&::-webkit-scrollbar-track': {
                  visibility: 'visible',
                },
                '&::-webkit-scrollbar-thumb': {
                  visibility: 'visible',
                },
              },
              '&::-webkit-scrollbar': {
                width: '8px',
                visibility: 'hidden',
              },
              '&::-webkit-scrollbar-track': {
                width: '10px',
                visibility: 'hidden',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(135, 137, 140, .2)',
                borderRadius: '24px',
                visibility: 'hidden',
              },
            }}
          >
            {getTaskLoading ? (
              <GSpinner width="100%" height={10} boxSize={8} />
            ) : currentFilterMember ? (
              column.tasks
                .map(taskId =>
                  taskListByProject.find(task => task._id === taskId)
                )
                .filter(task => task.assignee._id === currentFilterMember._id)
                .map((task, index) => (
                  <Draggable
                    draggableId={task?._id}
                    index={index}
                    key={task?.task_key}
                    isDragDisabled={
                      userInfo?._id === task.reporter._id ||
                      userInfo?._id === task.assignee._id
                        ? false
                        : true
                    }
                  >
                    {renderTaskComponent
                      ? taskProvided => renderTaskComponent(taskProvided, task)
                      : null}
                  </Draggable>
                ))
            ) : (
              column.tasks
                .map(taskId =>
                  taskListByProject.find(task => task._id === taskId)
                )
                .map((task, index) => (
                  <Draggable
                    draggableId={task?._id}
                    index={index}
                    key={task?.task_key}
                    isDragDisabled={
                      userInfo?._id === task.reporter._id ||
                      userInfo?._id === task.assignee._id
                        ? false
                        : true
                    }
                  >
                    {renderTaskComponent
                      ? taskProvided => {
                          if (
                            !(
                              userInfo?._id === task.reporter._id ||
                              userInfo?._id === task.assignee._id
                            )
                          ) {
                            taskProvided.draggableProps.cursor = 'pointer';
                          }
                          return renderTaskComponent(taskProvided, task);
                        }
                      : null}
                  </Draggable>
                ))
            )}
            {dropColumnProvided.placeholder}
          </Box>
        )}
      </Droppable>
    </Box>
  );
};

export default ColumnCard;
