import React from 'react';
import Icon from '@chakra-ui/icon';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Tooltip } from '@chakra-ui/tooltip';
import { HiInformationCircle } from 'react-icons/hi';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu';
import { Button } from '@chakra-ui/button';
import { Image } from '@chakra-ui/image';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { capitalize } from 'lodash';

const GFormMenu = ({
  title,
  isRequired,
  tooltip,
  placeholder,
  boxProps,
  items,
  onClick,
  value,
  renderValue,
  data,
  renderLeftItemAddon,
  itemTextProp,
  noCapOntext,
  valueTextProp,
  menuWidth,
  noIcon,
  noDisplayValueText,
  titleStyle,
  ...restMenuButtonProps
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
      <Menu>
        <MenuButton
          as={Button}
          width={menuWidth || '100%'}
          rightIcon={noIcon ? null : <Icon as={ChevronDownIcon} />}
          {...restMenuButtonProps}
        >
          {value && renderValue ? (
            renderValue(value)
          ) : value && typeof value === 'string' ? (
            <Text textAlign="left" fontWeight="normal">
              {value}
            </Text>
          ) : value && typeof value === 'object' ? (
            <Text textAlign="left" fontWeight="normal">
              {value[valueTextProp] || ''}
            </Text>
          ) : (
            <Text
              textAlign="left"
              fontWeight="normal"
              maxWidth="90%"
              isTruncated
              color="gray.400"
            >
              {placeholder || 'Select'}
            </Text>
          )}
        </MenuButton>
        <MenuList width="100%">
          {data.map(item => (
            <MenuItem onClick={() => onClick(item)}>
              <Flex alignItems="center">
                {renderLeftItemAddon ? renderLeftItemAddon(item) : null}
                {noDisplayValueText ? null : (
                  <Text>
                    {noCapOntext
                      ? item[itemTextProp] || item.label || ''
                      : capitalize(item[itemTextProp] || item.label || '')}
                  </Text>
                )}
              </Flex>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default GFormMenu;
