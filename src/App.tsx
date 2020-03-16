import React from 'react';
import { Router, Switch } from 'react-router';
import { Route, BrowserRouter, Redirect } from 'react-router-dom';
import DashboardPage from './pages/Dashboard';
import ComparisonPage from './pages/Comparison';

const App = (): JSX.Element => {
  return (
    // <AuthProvider>
    <BrowserRouter>
      <Switch>
        <Route exact path='/dashboard' component={DashboardPage} />
        <Route exact path='/comparison' component={ComparisonPage} />
        <Route exact path='/map' component={DashboardPage} />
        <Redirect from='/' to='/dashboard' />
        {/* <Route exact path='/login' component={Login} />
        <Route exact path='/signup' component={SignUp} /> */}
      </Switch>
    </BrowserRouter>
    // </AuthProvider>
  );
};

export default App;
