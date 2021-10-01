import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ROUTE_KEY } from 'src/configs/router';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';

const AppNavigation = () => {
  return (
    <Router>
      <Route path={ROUTE_KEY.Home} exact component={Login} />
      <Route path={ROUTE_KEY.Register} exact component={Register} />
    </Router>
  );
};

export default AppNavigation;
