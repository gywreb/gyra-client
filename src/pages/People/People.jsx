import { Button } from '@chakra-ui/button';
import Icon from '@chakra-ui/icon';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Box, Flex, Text, Wrap } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import React, { useEffect, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import GSpinner from 'src/components/GSpinner/GSpinner';
import PersonCard from 'src/components/PersonCard/PersonCard';
import { USER_PER_PAGE } from 'src/configs/constants';
import { inviteUser } from 'src/store/auth/actions';
import { getAllUser } from 'src/store/user/action';
import GLayout from '../../components/GLayout/GLayout';

const People = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { currentUserList, currentTotalPage, getAllLoading, isLoadMore } =
    useSelector(state => state.user);
  const { userInfo, inviteLoading } = useSelector(state => state.auth);
  const [page, setPage] = useState(1);
  const [inviteId, setInviteId] = useState(null);
  const [search, setSearch] = useState('');

  const handleLoadUser = (perPage, page, isLoadMore) => {
    dispatch(getAllUser(perPage, page, toast, isLoadMore));
  };

  console.log(`inviteId`, inviteId);

  useEffect(() => {
    handleLoadUser(USER_PER_PAGE, 1, false);
  }, []);

  const handleLoadMoreUser = () => {
    if (page < currentTotalPage) {
      handleLoadUser(USER_PER_PAGE, page + 1, true);
      setPage(prev => prev + 1);
    }
  };

  const handleInvite = user => {
    setInviteId(user._id);
    dispatch(inviteUser(user, toast, () => setInviteId(null)));
  };

  return (
    <GLayout>
      {getAllLoading ? (
        <GSpinner />
      ) : (
        <Box pr={8} pl={8} mt={4} mb={4}>
          <Text fontSize="3xl" color="orange.700" fontWeight="600">
            People
          </Text>
          <Flex alignItems="center" mt={4} justifyContent="center">
            <InputGroup maxWidth="50%">
              <Input
                variant="outline"
                id="search"
                type="text"
                focusBorderColor="orange.700"
                borderColor="orange.500"
                _hover={{ borderColor: 'orange.500' }}
                p={4}
                placeholder="Search the the person email you want to find..."
                onChange={e => setSearch(e.target.value)}
                value={search}
              />
              <InputRightElement>
                <Button bgColor="white" onClick={() => {}} mr={1} height="90%">
                  <Icon as={BsSearch} color="orange.700" />
                </Button>
              </InputRightElement>
            </InputGroup>
          </Flex>
          <Flex
            mt={6}
            overflowY="scroll"
            overflowX="hidden"
            flexDirection="column"
            css={{
              '&:hover': {
                '&::-webkit-scrollbar': {
                  visibility: 'visible',
                  overflow: 'hidden',
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
                background: '#A0AEC0',
                borderRadius: '24px',
                visibility: 'hidden',
              },
            }}
            flexDir="column"
            alignItems="center"
            justifyContent="center"
          >
            <Wrap
              justify="center"
              alignItems="center"
              spacing="40px"
              p={8}
              ml={24}
              mr={24}
            >
              {currentUserList?.length
                ? currentUserList
                    ?.filter(person => {
                      if (!search.length) return true;
                      let keyword = new RegExp(`${search}`, 'g');
                      return person.email.match(keyword);
                    })
                    .map(person => (
                      <PersonCard
                        isInviting={inviteLoading && person._id === inviteId}
                        isInvited={userInfo?.pendingUser.includes(person._id)}
                        personInfo={person}
                        handleInvite={() => handleInvite(person)}
                      />
                    ))
                : null}
            </Wrap>
            {page < currentTotalPage - 1 ? (
              <Button
                size="lg"
                colorScheme="orange"
                mt={6}
                onClick={handleLoadMoreUser}
                width="50%"
                isLoading={isLoadMore}
              >
                LOAD MORE
              </Button>
            ) : null}
          </Flex>
        </Box>
      )}
    </GLayout>
  );
};

export default People;
