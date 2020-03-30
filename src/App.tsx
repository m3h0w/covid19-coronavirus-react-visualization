import React, { useEffect, createRef } from 'react';
import { Switch, useHistory } from 'react-router';
import { Route, BrowserRouter, Redirect } from 'react-router-dom';
import DashboardPage from './pages/Dashboard';
import ComparisonPage from './pages/Comparison';
import Todo from './pages/Todo';
import MapPage from './pages/Map';
import googleAnalyticsInstance from './utils/googleAnalytics';
import { SnackbarProvider } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CustomizedSnackbar from './components/Snackbar';

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
      <Route path='/dashboard/:country' component={DashboardPage} />
      <Route exact path='/dashboard' component={DashboardPage} />
      <Route exact path='/world' component={MapPage} />
      <Route exact path='/map' component={MapPage} />
      <Route path='/infection-trajectories/:country' component={ComparisonPage} />
      <Route exact path='/infection-trajectories' component={ComparisonPage} />
      <Route exact path='/todo' component={Todo} />
      <Redirect from='/' to='/world' />
      {/* <Route exact path='/login' component={Login} />
  <Route exact path='/signup' component={SignUp} /> */}
    </Switch>
  );
};

const App = (): JSX.Element => {
  const notistackRef = createRef();
  const onClickDismiss = (key: string | number | undefined) => () => {
    if (notistackRef && notistackRef.current) {
      notistackRef.current.closeSnackbar(key);
    }
  };
  return (
    // <AuthProvider>
    <SnackbarProvider
      ref={notistackRef}
      action={(key) => (
        <IconButton
          color='inherit'
          aria-label='dismiss pop up'
          onClick={onClickDismiss(key)}
          edge='start'
        >
          <CloseIcon />
        </IconButton>
      )}
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      dense={false}
    >
      <CustomizedSnackbar />
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </SnackbarProvider>

    // </AuthProvider>
  );
};

export default App;
