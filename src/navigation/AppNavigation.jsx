import { useToast } from '@chakra-ui/toast';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import GOverlaySpinner from 'src/components/GOverlaySpinner/GOverlaySpinner';
import { ROUTE_KEY } from 'src/configs/router';
import Projects from 'src/pages/Projects/Projects';
import Tasks from 'src/pages/Tasks/Tasks';
import { getCurrent } from 'src/store/auth/actions';
import Login from '../pages/Login/Login';
import People from '../pages/People/People';
import Register from '../pages/Register/Register';
import Team from '../pages/Team/Team';
import AuthRoute from './AuthRoute/AuthRoute';
import PrivateRoute from './PrivateRoute/PrivateRoute';
import { Switch, useHistory, useLocation } from 'react-router';
import Board from 'src/pages/Board/Board';
import G404Page from 'src/components/G404Page/G404Page';

const AppNavigation = () => {
  const { userInfo, token, getCurrentLoading } = useSelector(
    state => state.auth
  );
  const dispatch = useDispatch();
  const history = useHistory();
  const toast = useToast();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname)
      dispatch(getCurrent(history, toast, location.pathname));
    else dispatch(getCurrent(history, toast));
  }, []);
  if (getCurrentLoading) return <GOverlaySpinner />;
  else
    return (
      <Switch>
        <Route
          path={ROUTE_KEY.Home}
          exact
          render={() =>
            userInfo || token ? (
              <Redirect to={ROUTE_KEY.Projects} />
            ) : (
              <Redirect to={ROUTE_KEY.Login} />
            )
          }
        />
        <PrivateRoute path={ROUTE_KEY.Projects} component={<Projects />} />
        <PrivateRoute path={ROUTE_KEY.Tasks} component={<Tasks />} />
        <PrivateRoute path={ROUTE_KEY.Team} component={<Team />} />
        <PrivateRoute path={ROUTE_KEY.People} component={<People />} />
        <PrivateRoute path={ROUTE_KEY.Board} component={<Board />} />
        <AuthRoute path={ROUTE_KEY.Register} component={<Register />} />
        <AuthRoute path={ROUTE_KEY.Login} component={<Login />} />
        <Route path="*" component={G404Page} />
      </Switch>
    );
};

export default AppNavigation;
