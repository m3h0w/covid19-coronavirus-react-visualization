import React from 'react';
import Share from 'components/Share';
import { makeStyles, Theme } from '@material-ui/core';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import PublicIcon from '@material-ui/icons/Public';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { useHistory, useLocation } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  navWrapper: {
    position: 'fixed',
    width: '100vw',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
    bottom: 0,
    left: 0,
  },
}));

const useActionStyles = makeStyles((theme: Theme) => ({
  root: {
    '&$selected': {
      color: theme.palette.secondary.main,
    },
  },
  selected: {},
}));

const BottomNavigationBar = () => {
  const classes = useStyles();
  const actionElementClasses = useActionStyles();
  const location = useLocation();
  const history = useHistory();
  const theme = useTheme();

  let value;
  switch (location.pathname.split('/')[1]) {
    case 'world':
      value = 0;
      break;
    case 'dashboard':
      value = 1;
      break;
    case 'infection-trajectories':
      value = 2;
      break;
  }

  return (
    <div>
      <Share />
      <div className={classes.navWrapper}>
        <BottomNavigation
          value={value}
          onChange={(event, actionValue) => {
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
          color={theme.palette.secondary.main}
        >
          <BottomNavigationAction
            classes={actionElementClasses}
            label='World'
            icon={<PublicIcon />}
          />
          <BottomNavigationAction
            classes={actionElementClasses}
            label='Dashboard'
            icon={<DashboardIcon />}
          />
          <BottomNavigationAction
            classes={actionElementClasses}
            label='Trajectories'
            icon={<TrendingUpIcon />}
          />
        </BottomNavigation>
      </div>
    </div>
  );
};

export default BottomNavigationBar;
