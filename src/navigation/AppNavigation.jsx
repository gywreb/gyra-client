import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { ROUTE_KEY } from 'src/configs/router';
import Home from 'src/pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
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
            <Redirect to={ROUTE_KEY.Home} />
          ) : (
            <Redirect to={ROUTE_KEY.Login} />
          )
        }
      />
      <PrivateRoute path={ROUTE_KEY.Home} component={<Home />} />
      <AuthRoute path={ROUTE_KEY.Register} component={<Register />} />
      <AuthRoute path={ROUTE_KEY.Login} component={<Login />} />
    </Router>
  );
};

export default AppNavigation;
