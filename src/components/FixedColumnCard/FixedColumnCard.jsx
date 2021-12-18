import { Box, Flex, Text } from '@chakra-ui/layout';
import React, { useState } from 'react';
import { BaseStyles } from 'src/configs/styles';
import GSpinner from '../GSpinner/GSpinner';

const FixedColumnCard = ({
  column,
  getTaskLoading,
  taskListByProject,
  renderTaskComponent,
  currentFilterMember,
  titleStyle,
  ...restBoxProps
}) => {
  return (
    <Box
      minWidth={BaseStyles.columnWidth}
      minHeight={BaseStyles.addColumnHeight}
      p={2}
      mr={4}
      bgColor="gray.100"
      borderRadius={6}
      cursor="pointer"
      // _hover={{ bgColor: 'gray.200' }}
      transition="all 0.4s"
      {...restBoxProps}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="gray.600" ml={2} {...titleStyle}>
          {column?.name || ''}
        </Text>
      </Flex>

      <Box
        mt={4}
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
            .filter(task => task.assignee._id === currentFilterMember._id)
            .map((task, index) =>
              renderTaskComponent ? () => renderTaskComponent(null, task) : null
            )
        ) : (
          column.tasks.map((task, index) =>
            renderTaskComponent ? renderTaskComponent(null, task) : null
          )
        )}
      </Box>
    </Box>
  );
};

export default FixedColumnCard;
