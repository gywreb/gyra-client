import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ROUTE_KEY } from 'src/configs/router';
import Login from '../pages/Login/Login';

const AppNavigation = () => {
  return (
    <Router>
      <Route path={ROUTE_KEY.Home} component={Login} />
    </Router>
  );
};

export default AppNavigation;
