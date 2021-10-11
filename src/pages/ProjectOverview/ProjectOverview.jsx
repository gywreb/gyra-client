import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router';
import GLayout from '../../components/GLayout/GLayout';
import { NAVIGATION_KEY } from '../../configs/navigation';
import { setCurrentActive } from '../../store/navigation/action';

const ProjectOverview = () => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrentActive(NAVIGATION_KEY.PROJECT));
  }, []);
  console.log(match);

  return <GLayout>Project Overview</GLayout>;
};

export default ProjectOverview;
