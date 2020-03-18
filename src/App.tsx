import React, { useEffect } from 'react';
import { Switch, useHistory } from 'react-router';
import { Route, BrowserRouter, Redirect } from 'react-router-dom';
import DashboardPage from './pages/Dashboard';
import ComparisonPage from './pages/Comparison';
import Todo from './pages/Todo';
import MapPage from './pages/Map';
import googleAnalyticsInstance from './utils/googleAnalytics';

const Routes = () => {
  const history = useHistory();

  useEffect(() => {
    let prevLocation: Location;
    const unlisten = history.listen((location, action) => {
      if (!prevLocation || prevLocation.pathname !== location.pathname) {
        googleAnalyticsInstance.pageView();
      }
      prevLocation = location;
    });
    return () => unlisten();
  }, [history]);

  return (
    <Switch>
      <Route exact path='/map' component={MapPage} />
      <Route exact path='/dashboard' component={DashboardPage} />
      <Route exact path='/comparison' component={ComparisonPage} />
      <Route exact path='/todo' component={Todo} />
      <Redirect from='/' to='/map' />
      {/* <Route exact path='/login' component={Login} />
  <Route exact path='/signup' component={SignUp} /> */}
    </Switch>
  );
};

const App = (): JSX.Element => {
  return (
    // <AuthProvider>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
    // </AuthProvider>
  );
};

export default App;
