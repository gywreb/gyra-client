import Icon from '@chakra-ui/icon';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Tooltip } from '@chakra-ui/tooltip';
import moment from 'moment';
import React, { useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import { DateRangeInput } from 'src/shared/react-chakra-date-picker';

const GDatePicker = ({ title, isRequired, tooltip, boxProps }) => {
  const [date, setDate] = useState(moment().toDate());
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
      <DateRangeInput
        minBookingDate={moment().toDate()}
        startPlaceholder="Begin Date"
        endPlaceholder="End Date"
      />
    </Box>
  );
};

export default GDatePicker;
