import { Box, Flex, Text } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import GLayout from 'src/components/GLayout/GLayout';
import { NAVIGATION_KEY, sideBarNavItems } from 'src/configs/navigation';
import { getActivityList } from 'src/store/activity/action';
import { useHistory, useRouteMatch } from 'react-router';
import { ACTIVITY_PER_PAGE } from 'src/configs/constants';
import {
  setCurrentActive,
  setCurrentSidebarActive,
} from 'src/store/navigation/action';
import GSpinner from 'src/components/GSpinner/GSpinner';
import { Avatar } from '@chakra-ui/avatar';
import { Image } from '@chakra-ui/image';
import { chakra } from '@chakra-ui/system';
import moment from 'moment';
import { Button } from '@chakra-ui/button';

const Span = chakra('span', {
  baseStyle: {},
});

const Activity = () => {
  const { currentSidebarActive } = useSelector(state => state.navigation);
  const {
    getActivityLoading,
    currentActivityList,
    currentTotalPage,
    isLoadMore,
  } = useSelector(state => state.activity);
  const { currentProject } = useSelector(state => state.project);
  const toast = useToast();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const [page, setPage] = useState(1);

  const requestActivityData = async (projectId, perPage, page, isLoadMore) => {
    dispatch(getActivityList(projectId, perPage, page, toast, isLoadMore));
  };

  useEffect(() => {
    dispatch(setCurrentActive(NAVIGATION_KEY.PROJECT));
    dispatch(setCurrentSidebarActive(NAVIGATION_KEY.ACTIVITY));
  }, []);

  useEffect(() => {
    if (match && match.params?.projectId) {
      requestActivityData(
        match.params.projectId,
        ACTIVITY_PER_PAGE,
        page,
        null
      );
    }
  }, [match]);

  const handleLoadMoreActivity = () => {
    if (page < currentTotalPage) {
      requestActivityData(
        currentProject?._id,
        ACTIVITY_PER_PAGE,
        page + 1,
        true
      );
      setPage(prev => prev + 1);
    }
  };

  const renderActivityItem = (item, index) => {
    return (
      <Flex
        alignItems="flex-start"
        pt={4}
        pb={4}
        borderTopColor="gray.300"
        borderBottomColor={
          index === currentActivityList.length - 1 ? 'gray.300' : 'white'
        }
        borderTopWidth={1.5}
        borderBottomWidth={index === currentActivityList.length - 1 ? 1.5 : 0}
      >
        <Flex borderColor="orange.700" borderWidth={2} mr={2} borderRadius={10}>
          <Image
            minW="40px"
            src={`https://avatars.dicebear.com/api/gridy/${item?.creator?.username}.svg`}
            bgColor="gray.100"
            padding="2px"
            borderRadius={10}
          />
        </Flex>
        <Box>
          <Text color="gray.700">
            <Span fontWeight="600" color="orange.700">
              {item?.creator?.username}{' '}
            </Span>
            {item.content}
          </Text>
          <Text fontSize="xs" color="gray.500" fontStyle="italic">
            {`${moment(item.createdAt).format('DD/MM/yyyy')} at ${moment(
              item.createdAt
            ).format('h:mm A')}`}
          </Text>
        </Box>
      </Flex>
    );
  };

  return (
    <GLayout isHasSideBar>
      {getActivityLoading ? (
        <GSpinner />
      ) : (
        <Box
          pl={8}
          pr={8}
          pt={6}
          pb={6}
          width="100%"
          overflowX="hidden"
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
              background: 'rgba(135, 137, 140, .5)',
              borderRadius: '24px',
              visibility: 'hidden',
            },
          }}
        >
          <Text fontSize="2xl" fontWeight="600" color="orange.500">
            {sideBarNavItems.find(item => item.id === currentSidebarActive)
              ?.name || 'Board'}
          </Text>
          <Box mt={9} width="100%">
            {currentActivityList?.map((activity, index) =>
              renderActivityItem(activity, index)
            )}
            {page < currentTotalPage ? (
              <Button
                size="lg"
                colorScheme="orange"
                isFullWidth
                mt={6}
                onClick={handleLoadMoreActivity}
                isLoading={isLoadMore}
              >
                LOAD MORE
              </Button>
            ) : null}
          </Box>
        </Box>
      )}
    </GLayout>
  );
};

export default Activity;
