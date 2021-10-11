import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { ROUTE_KEY } from 'src/configs/router';
import Projects from 'src/pages/Projects/Projects';
import Tasks from 'src/pages/Tasks/Tasks';
import Login from '../pages/Login/Login';
import People from '../pages/People/People';
import ProjectOverview from '../pages/ProjectOverview/ProjectOverview';
import Register from '../pages/Register/Register';
import Team from '../pages/Team/Team';
import AuthRoute from './AuthRoute/AuthRoute';
import PrivateRoute from './PrivateRoute/PrivateRoute';

const AppNavigation = () => {
  const { userInfo, token } = useSelector(state => state.auth);
  return (
    <Router>
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
      <Route path={ROUTE_KEY.ProjectDetail} exact component={ProjectOverview} />
      <AuthRoute path={ROUTE_KEY.Register} component={<Register />} />
      <AuthRoute path={ROUTE_KEY.Login} component={<Login />} />
    </Router>
  );
};

export default AppNavigation;
