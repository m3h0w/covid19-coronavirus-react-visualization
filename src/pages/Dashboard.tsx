import React, { useState, useEffect, FC } from 'react';
import Dashboard from 'components/Dashboard/Dashboard';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { CustomAutocomplete } from '../components/Dashboard/Select';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Chart from '../components/Dashboard/Chart';
import CurrentCount from '../components/Dashboard/CurrentCount';
import clsx from 'clsx';
import createPersistedState from '../utils/memoryState';
import useDataStore from '../data/dataStore';
import { observer } from 'mobx-react-lite';
import { useHistory, RouteComponentProps } from 'react-router';
import { Typography, Card, ButtonBase } from '@material-ui/core';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    color: 'white',
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 15,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'visible',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 400,
  },
}));

const useMemoryState = createPersistedState();

const DashboardPage: FC<RouteComponentProps> = observer((props) => {
  const classes = useStyles();
  const [selectedCountry, setSelectedCountry] = useMemoryState('Poland');
  const dataStore = useDataStore();
  const rowData = dataStore.getCountryData(selectedCountry);
  const possibleCountries = dataStore.possibleCountries;
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const history = useHistory();
  const theme = useTheme();

  useEffect(() => {
    const countryFromUrl = props.match.params.country;
    if (countryFromUrl) {
      history.push(`/dashboard`);
      setSelectedCountry(countryFromUrl);
    }
  }, [props.match.params.country, history, setSelectedCountry]);

  return (
    <Dashboard title='Country dashboard'>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <CustomAutocomplete
            label={'Select country'}
            handleChange={setSelectedCountry}
            selectedValue={selectedCountry}
            possibleValues={possibleCountries}
            id={'select-country'}
            width={'auto'}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} md={8} lg={9}>
        <Paper className={fixedHeightPaper}>
          <Chart country={selectedCountry} rowData={rowData} dates={dataStore.dates} />
        </Paper>
      </Grid>
      <Grid item xs={6} md={4} lg={3}>
        <Paper className={classes.paper}>
          {rowData && rowData.confirmed && rowData.dead && (
            <CurrentCount
              confirmedCases={
                Object.values(rowData.confirmed)[Object.values(rowData.confirmed).length - 1]
              }
              deaths={Object.values(rowData.dead)[Object.values(rowData.dead).length - 1]}
              mortalityRate={
                Object.values(rowData.dead)[Object.values(rowData.dead).length - 1] /
                Object.values(rowData.confirmed)[Object.values(rowData.confirmed).length - 1]
              }
            />
          )}
        </Paper>
        <div style={{ height: '20px' }} />
        <Card>
          <ButtonBase
            className={classes.paper}
            style={{ backgroundColor: theme.palette.secondary.main, cursor: 'pointer' }}
            onClick={() => {
              history.push(`/infection-trajectories/${selectedCountry}`);
            }}
          >
            <Typography variant='h5'>Compare infection trajectories</Typography>
          </ButtonBase>
        </Card>
        {/* <Paper className={classes.paper}></Paper> */}
      </Grid>
      {/* Recent Orders */}
      {/* <Grid item xs={12}>
    <Paper className={classes.paper}>
      <Orders />
    </Paper>
  </Grid> */}
    </Dashboard>
  );
});

export default DashboardPage;
