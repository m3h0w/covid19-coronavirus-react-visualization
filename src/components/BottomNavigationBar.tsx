import React, { useState, useEffect } from 'react';
import Share from 'components/Share';
import { makeStyles } from '@material-ui/core';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import PublicIcon from '@material-ui/icons/Public';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { useHistory, useLocation } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  navWrapper: {
    position: 'fixed',
    width: '100vw',
    //marginLeft: SIDEBAR_WIDTH,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
    bottom: 0,
    left: 0,
  },
}));
const BottomNavigationBar = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    switch (location.pathname) {
      case '/world':
        setValue(0);
        break;
      case '/dashboard':
        setValue(1);
        break;
      case '/infection-trajectories':
        setValue(2);
        break;
    }
  }, [location]);
  return (
    <div style={{ marginTop: 40 }}>
      <Share />
      <div className={classes.navWrapper}>
        <BottomNavigation
          value={value}
          onChange={async (event, actionValue) => {
            setValue(actionValue);
            switch (actionValue) {
              case 0:
                history.push('/world');
                break;
              case 1:
                history.push('/dashboard');
                break;
              case 2:
                history.push('/infection-trajectories');
                break;
            }
          }}
          showLabels
          style={{ width: '100%' }}
        >
          <BottomNavigationAction label='World' icon={<PublicIcon />} />
          <BottomNavigationAction label='Dashboard' icon={<DashboardIcon />} />
          <BottomNavigationAction label='Trajectories' icon={<TrendingUpIcon />} />
        </BottomNavigation>
      </div>
    </div>
  );
};

export default BottomNavigationBar;
