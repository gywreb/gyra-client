import { Button, IconButton } from '@chakra-ui/button';
import Icon from '@chakra-ui/icon';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Box, Flex, Text } from '@chakra-ui/layout';
import React, { useEffect } from 'react';
import { BsSearch } from 'react-icons/bs';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/table';
import { Link } from 'react-router-dom';
import { Image } from '@chakra-ui/image';
import { Avatar } from '@chakra-ui/avatar';
import moment from 'moment';
import { FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa';
import {
  Pagination,
  usePagination,
  PaginationPage,
  PaginationNext,
  PaginationPrevious,
  PaginationPageGroup,
  PaginationContainer,
  PaginationSeparator,
} from '@ajna/pagination';
import { useDisclosure } from '@chakra-ui/hooks';
import ProjectCreateModal from 'src/components/ProjectCreateModal/ProjectCreateModal';
import GLayout from 'src/components/GLayout/GLayout';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectList } from '../../store/project/action';
import { useToast } from '@chakra-ui/toast';
import { setCurrentActive } from '../../store/navigation/action';
import { NAVIGATION_KEY } from '../../configs/navigation';
import { ROUTE_KEY } from 'src/configs/router';
import { useHistory } from 'react-router';

const Projects = () => {
  // constants
  const outerLimit = 2;
  const innerLimit = 2;
  const PAGE_SIZE = 5;

  const history = useHistory();
  const dispatch = useDispatch();
  const { projectList } = useSelector(state => state.project);

  const {
    pages,
    pagesCount,
    offset,
    currentPage,
    setCurrentPage,
    setIsDisabled,
    isDisabled,
    pageSize,
    setPageSize,
  } = usePagination({
    total: projectList?.length,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: {
      pageSize: PAGE_SIZE,
      isDisabled: false,
      currentPage: 1,
    },
  });

  const toast = useToast();

  useEffect(() => {
    dispatch(setCurrentActive(NAVIGATION_KEY.PROJECT));
    dispatch(getProjectList(toast));
  }, []);

  const handlePageChange = nextPage => {
    setCurrentPage(nextPage);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <GLayout>
      <Box pr={8} pl={8} mt={4} mb={4}>
        <Text fontSize="3xl" color="orange.700" fontWeight="600">
          Projects
        </Text>
        <Flex alignItems="center" mt={4} justifyContent="space-between">
          <InputGroup width="500">
            <Input
              variant="outline"
              id="search"
              type="text"
              focusBorderColor="orange.700"
              borderColor="orange.500"
              _hover={{ borderColor: 'orange.500' }}
              p={4}
            />
            <InputRightElement>
              <Button bgColor="white" onClick={() => {}} mr={1} height="90%">
                <Icon as={BsSearch} color="orange.700" />
              </Button>
            </InputRightElement>
          </InputGroup>
          <Button
            variant="solid"
            colorScheme="orange"
            rightIcon={<Icon as={FaPlus} color="white" />}
            onClick={onOpen}
          >
            Create
          </Button>
        </Flex>
        <Box mt={4}>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            isDisabled={isDisabled}
            onPageChange={handlePageChange}
          >
            <PaginationContainer w="full" mb={8}>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Key</Th>
                    <Th>Project Manager</Th>
                    <Th>Begin Date</Th>
                    <Th>EST End Date</Th>
                    <Th padding={0}></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {projectList
                    ?.slice(
                      pageSize * (currentPage - 1),
                      pageSize * currentPage
                    )
                    .map(item => (
                      <Tr>
                        <Td>
                          <Flex alignItems="center">
                            <Flex
                              borderWidth={2}
                              borderRadius={10}
                              borderColor="orange.700"
                              mr={4}
                            >
                              <Image
                                width={10}
                                height={10}
                                src={`https://avatars.dicebear.com/api/jdenticon/${item.key}.svg`}
                              />
                            </Flex>
                            <Box
                              cursor="pointer"
                              onClick={() =>
                                history.push(
                                  `${NAVIGATION_KEY.BOARD}/${item._id}`
                                )
                              }
                            >
                              <Text color="orange.500">{item.name || ''}</Text>
                            </Box>
                          </Flex>
                        </Td>
                        <Td>{item.key || ''}</Td>
                        <Td>
                          <Flex alignItems="center">
                            <Avatar
                              cursor="pointer"
                              size="md"
                              src={`https://avatars.dicebear.com/api/gridy/${item.manager?.username}.svg`}
                              bgColor="orange.50"
                              padding="2px"
                              onClick={() => {}}
                              borderColor="orange.700"
                              borderWidth={2}
                              mr={4}
                            />
                            <Link to={ROUTE_KEY.Projects}>
                              <Text color="orange.500">
                                {item.manager?.fullname ||
                                  item.manager?.username ||
                                  ''}
                              </Text>
                            </Link>
                          </Flex>
                        </Td>
                        <Td>{moment(item.begin_date).format('DD/MM/yyyy')}</Td>
                        <Td>
                          {item.end_date
                            ? moment(item.end_date).format('DD/MM/yyyy')
                            : `NOT DETEMINED`}
                        </Td>
                        <Td padding={0}>
                          <IconButton
                            cursor="pointer"
                            as={HiOutlineDotsVertical}
                            color="orange.700"
                            bgColor="white"
                            _active={{ bgColor: 'orange.200' }}
                            _hover={{ bgColor: 'orange.100' }}
                          />
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </PaginationContainer>
            {projectList?.length > PAGE_SIZE ? (
              <Flex alignItems="center" justifyContent="flex-end">
                <PaginationPrevious
                  _hover={{
                    bg: 'orange.500',
                  }}
                  bg="orange.500"
                  onClick={() =>
                    console.log(
                      'Im executing my own function along with Previous component functionality'
                    )
                  }
                  mr={4}
                >
                  <Icon as={FaChevronLeft} color="white" />
                </PaginationPrevious>
                <PaginationPageGroup
                  isInline
                  align="center"
                  separator={
                    <PaginationSeparator
                      onClick={() =>
                        console.log(
                          'Im executing my own function along with Separator component functionality'
                        )
                      }
                      bg="blue.300"
                      fontSize="sm"
                      w={7}
                      jumpSize={11}
                    />
                  }
                >
                  {pages.map(page => (
                    <PaginationPage
                      w={10}
                      fontSize="lg"
                      bg="orange.50"
                      color="orange.500"
                      borderColor="orange.500"
                      borderWidth={2}
                      key={`pagination_page_${page}`}
                      page={page}
                      onClick={() =>
                        console.log(
                          'Im executing my own function along with Page component functionality'
                        )
                      }
                      _hover={{
                        bg: 'orange.500',
                        color: 'white',
                      }}
                      _current={{
                        bg: 'orange.500',
                        color: 'white',
                      }}
                    />
                  ))}
                </PaginationPageGroup>
                <PaginationNext
                  ml={4}
                  _hover={{
                    bg: 'orange.500',
                  }}
                  bg="orange.500"
                  onClick={() =>
                    console.log(
                      'Im executing my own function along with Previous component functionality'
                    )
                  }
                >
                  <Icon as={FaChevronRight} color="white" />
                </PaginationNext>
              </Flex>
            ) : null}
          </Pagination>
          <ProjectCreateModal isOpen={isOpen} onClose={onClose} />
        </Box>
      </Box>
    </GLayout>
  );
};

export default Projects;
