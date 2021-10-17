import Icon from '@chakra-ui/icon';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Tooltip } from '@chakra-ui/tooltip';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import {
  DateRangeInput,
  DateSingleInput,
} from 'src/shared/react-chakra-date-picker/src';

const GDatePicker = ({
  title,
  isRequired,
  tooltip,
  boxProps,
  placeholder,
  name,
  minDate,
  maxDate,
  ...restDatePicker
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
      <DateSingleInput
        name={name}
        minBookingDate={
          minDate ? moment(minDate).add(1, 'day').toDate() : moment().toDate()
        }
        maxBookingDate={
          maxDate ? moment(maxDate).subtract(1, 'day').toDate() : null
        }
        placeholder={placeholder || 'Choose date'}
        {...restDatePicker}
      />
    </Box>
  );
};

export default GDatePicker;
