import React from 'react';
import { Router, Switch } from 'react-router';
import { Route, BrowserRouter, Redirect } from 'react-router-dom';
import DashboardPage from './pages/Dashboard';
import ComparisonPage from './pages/Comparison';
import Todo from './pages/Todo';
import MapPage from './pages/Map';

const App = (): JSX.Element => {
  return (
    // <AuthProvider>
    <BrowserRouter>
      <Switch>
        <Route exact path='/dashboard' component={DashboardPage} />
        <Route exact path='/comparison' component={ComparisonPage} />
        <Route exact path='/map' component={MapPage} />
        <Route exact path='/todo' component={Todo} />

        <Redirect from='/' to='/dashboard' />
        {/* <Route exact path='/login' component={Login} />
        <Route exact path='/signup' component={SignUp} /> */}
      </Switch>
    </BrowserRouter>
    // </AuthProvider>
  );
};

export default App;
