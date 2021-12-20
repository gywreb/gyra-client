import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/breadcrumb';
import { Button } from '@chakra-ui/button';
import { FormControl, FormErrorMessage } from '@chakra-ui/form-control';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { chakra } from '@chakra-ui/system';
import { useToast } from '@chakra-ui/toast';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import GAutoCompletePicker from 'src/components/GAutoCompletePicker/GAutoCompletePicker';
import GDatePicker from 'src/components/GDatePicker/GDatePicker';
import GLayout from 'src/components/GLayout/GLayout';
import GTextEditor from 'src/components/GTextEditor/GTextEditor';
import GTextInput from 'src/components/GTextInput/GTextInput';
import { NAVIGATION_KEY, sideBarNavItems } from 'src/configs/navigation';
import { ROUTE_KEY } from 'src/configs/router';
import {
  setCurrentActive,
  setCurrentSidebarActive,
} from 'src/store/navigation/action';
import { editProject, getProjectDetail } from 'src/store/project/action';
import { extractKeyFromNameTxt } from 'src/utils/extractKeyFromNameTxt';

const Form = chakra('form', {
  baseStyle: {
    width: '100%',
  },
});

const Setting = () => {
  const match = useRouteMatch();
  const history = useHistory();
  const toast = useToast();
  const dispatch = useDispatch();
  const { currentSidebarActive } = useSelector(state => state.navigation);
  const { currentProject, editLoading } = useSelector(state => state.project);
  const { userInfo } = useSelector(state => state.auth);

  const formDefaultVal = {
    name: currentProject?.name || '',
    key: currentProject?.key || '',
    description: currentProject?.description || '',
    begin_date: currentProject?.begin_date || '',
    end_date: currentProject?.end_date || '',
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
    setValue,
    clearErrors,
  } = useForm({
    name: '',
    key: '',
    description: '',
    begin_date: '',
    end_date: '',
  });

  const [beginDate, setBeginDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (currentProject?.manager?._id === userInfo?._id) {
      setIsAuthorized(true);
    }
  }, [currentProject]);

  useEffect(() => {
    dispatch(setCurrentActive(NAVIGATION_KEY.PROJECT));
    dispatch(setCurrentSidebarActive(NAVIGATION_KEY.SETTING));
  }, []);

  useEffect(() => {
    setInitialValue();
  }, [currentProject]);

  const setInitialValue = () => {
    if (currentProject) {
      for (let key in currentProject) {
        if (key in formDefaultVal) {
          setValue(key, currentProject[key]);
        }
      }
    }
  };

  useEffect(() => {
    if (match && match.params?.projectId) {
      dispatch(getProjectDetail(match.params.projectId, history, toast));
    }
  }, [match]);

  const onEditProject = params => {
    if (params) {
      dispatch(editProject(currentProject?._id, params, toast));
    }
  };

  return (
    <GLayout isHasSideBar boxProps={{ overflowY: 'hidden' }}>
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
        <Breadcrumb mb={2}>
          <BreadcrumbItem color="gray.500">
            <BreadcrumbLink href="#">
              <Link to={ROUTE_KEY.Projects}>Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem color="gray.500">
            <Text>{currentProject?.name || 'Unknown'}</Text>
          </BreadcrumbItem>
          <BreadcrumbItem color="gray.500">
            <Text>{`${currentProject?.key} Board` || 'Board'}</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        <Flex flexDir="column" alignItems="center" justifyContent="center">
          <Box>
            <Text fontSize="2xl" fontWeight="600" color="orange.500">
              {sideBarNavItems.find(item => item.id === currentSidebarActive)
                ?.name || 'Board'}
            </Text>
            <Form mt={6}>
              <FormControl isInvalid={errors.name}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value, name } }) => (
                    <GTextInput
                      disabled={!isAuthorized}
                      autoComplete="off"
                      title="Name"
                      placeholder="Type in your dream project name"
                      onChange={text => {
                        onChange(text);
                      }}
                      onBlur={onBlur}
                      value={value}
                    />
                  )}
                  name="name"
                  rules={{
                    required: {
                      value: true,
                      message: 'Project name is required',
                    },
                  }}
                />
                <FormErrorMessage mb={4}>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.key}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value, name } }) => (
                    <GTextInput
                      disabled={true}
                      title="Key"
                      placeholder="Auto generate from your project name"
                      onBlur={onBlur}
                      value={value}
                    />
                  )}
                  name="key"
                  rules={{
                    required: {
                      value: true,
                      message: 'Project key is required',
                    },
                  }}
                />
                <FormErrorMessage mb={4}>
                  {errors.key && errors.key.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.description}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value, name } }) => (
                    <GTextEditor
                      readOnly={!isAuthorized}
                      autoComplete="off"
                      title="Description"
                      placeholder="Type in task description"
                      onChange={(content, delta, source, editor) => {
                        onChange(content);
                      }}
                      value={value}
                    />
                  )}
                  name="description"
                  defaultValue=""
                />
                <FormErrorMessage mb={4}>
                  {errors.description && errors.description.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.begin_date}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value, name } }) => (
                    <GDatePicker
                      date={value}
                      title="Begin Date"
                      placeholder="Select the date your project start"
                      isDisabled={true}
                    />
                  )}
                  name="begin_date"
                  rules={{
                    required: {
                      value: true,
                      message: 'Begin date is required',
                    },
                  }}
                />
                <FormErrorMessage mb={4}>
                  {errors.begin_date && errors.begin_date.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.end_date}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value, name } }) => (
                    <GDatePicker
                      date={value}
                      title="Estimate End Date"
                      placeholder="Select the estimate date your project will end"
                      onChange={date => {
                        onChange(date);
                        setEndDate(date);
                      }}
                      minDate={beginDate || currentProject?.begin_date}
                    />
                  )}
                  name="end_date"
                />
                <FormErrorMessage mb={4}>
                  {errors.end_date && errors.begin_date.end_date}
                </FormErrorMessage>
              </FormControl>
              {isAuthorized ? (
                <Flex alignItems="center" justifyContent="flex-end" mt={10}>
                  <Button
                    colorScheme="orange"
                    mr={3}
                    type="submit"
                    onClick={handleSubmit(onEditProject)}
                    isLoading={editLoading}
                    disabled={isDirty ? false : true}
                  >
                    Save Changes
                  </Button>
                  <Button
                    colorScheme="gray"
                    variant="solid"
                    onClick={() => {
                      setInitialValue();
                      clearErrors();
                    }}
                  >
                    Reset
                  </Button>
                </Flex>
              ) : null}
            </Form>
          </Box>
        </Flex>
      </Box>
    </GLayout>
  );
};

export default Setting;
