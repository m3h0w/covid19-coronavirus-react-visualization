import React from 'react';
import { Switch } from 'react-router';
import { Route, Redirect } from 'react-router-dom';
import DashboardPage from './pages/Dashboard';
import MapPage from './pages/Map';
import ComparisonPage from './pages/Comparison';
import Todo from './pages/Todo';
import { BooleanParam, useQueryParam, withDefault } from 'use-query-params';
import { perCapitaState } from './components/PerCapitaSwitch';
import { autorun } from 'mobx';

const CustomSwitch = () => {
  const [perCapita, setPerCapita] = useQueryParam<boolean>(
    'per_capita',
    withDefault(BooleanParam, false)
  );

  React.useEffect(() => {
    autorun(() => {
      if (perCapita !== perCapitaState.perCapitaBool) {
        setPerCapita(perCapitaState.perCapitaBool);
      }
    });
  }, []);

  return (
    <Switch>
      <Route path='/dashboard/:country' component={DashboardPage} />
      <Route exact path='/dashboard' component={DashboardPage} />
      <Route exact path='/world' component={MapPage} />
      <Route exact path='/map' component={MapPage} />
      <Route path='/infection-trajectories/:country' component={ComparisonPage} />
      <Route exact path='/infection-trajectories' component={ComparisonPage} />
      <Route exact path='/todo' component={Todo} />
      <Redirect from='/' to='/infection-trajectories' />
      {/* <Route exact path='/login' component={Login} />
  <Route exact path='/signup' component={SignUp} /> */}
    </Switch>
  );
};

export default CustomSwitch;
