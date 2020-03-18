import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from 'components/Dashboard/Dashboard';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { CustomAutocomplete } from '../components/Dashboard/Select';
import { makeStyles } from '@material-ui/core/styles';
import Chart from '../components/Dashboard/Chart';
import CurrentCount from '../components/Dashboard/CurrentCount';
import clsx from 'clsx';
import { csv } from 'd3-request';
import confirmedCsvUrl from '../data/confirmed.csv';
import deathsCsvUrl from '../data/deaths.csv';
import { Row } from '../components/Dashboard/Chart';
import MultiChart from '../components/Dashboard/MultiChart';
import { Chip } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import createPersistedState from '../utils/memoryState';
import useDataStore from '../data/dataStore';
import { observer } from 'mobx-react-lite';

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
    marginRight: 36,
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
  clipWrapper: {
    display: 'flex',
  },
}));

interface IRowData {
  confirmed: Row | undefined;
  dead: Row | undefined;
}

const CustomClip = ({ handleDelete, label }) => (
  <Chip
    style={{ margin: 5 }}
    // avatar={<Avatar alt='Natacha' src='/static/images/avatar/1.jpg' />}
    label={label}
    onDelete={handleDelete}
  />
);

const useMemoryState = createPersistedState();

const ComparisonPage = observer(() => {
  const classes = useStyles();
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [data, setData] = useMemoryState<{ [key: string]: IRowData }>();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const dataStore = useDataStore();
  const possibleCountries = dataStore.possibleCountries;

  const addCountry = useCallback(
    (country) => {
      setData((oldData) => {
        const newData = { ...oldData };
        newData[country] = dataStore.getCountryData(country);
        return newData;
      });
    },
    [dataStore, setData]
  );

  useEffect(() => {
    if (dataStore.ready) {
      addCountry('Italy');
    }
  }, [addCountry, dataStore, dataStore.ready]);

  return (
    <Dashboard title='Comparison'>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <CustomAutocomplete
            label={'Add country'}
            handleChange={(country) => {
              addCountry(country);
              setSelectedCountry(null);
            }}
            selectedValue={selectedCountry}
            possibleValues={possibleCountries}
            id={'select-country'}
            width={'auto'}
          />
          <div className={classes.clipWrapper}>
            {data &&
              Object.keys(data).map((country) => (
                <CustomClip
                  handleDelete={() => {
                    setData((prevRowData) => {
                      const newRowData = { ...prevRowData };
                      delete newRowData[country];
                      return newRowData;
                    });
                  }}
                  label={country}
                />
              ))}
          </div>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={fixedHeightPaper}>
          <MultiChart
            title={'Cases'}
            yLabel={'No. cases'}
            countries={data ? Object.keys(data) : []}
            dataByCountry={data}
            dates={dataStore.dates}
          />
        </Paper>
      </Grid>
      {/* <Grid item xs={12} md={4} lg={3}>
        <Paper className={fixedHeightPaper}>
          {rowData &&
            rowData[selectedCountry] &&
            rowData[selectedCountry].confirmed &&
            rowData[selectedCountry].dead && (
              <CurrentCount
                confirmedCases={
                  Object.values(rowData[selectedCountry].confirmed)[
                    Object.values(rowData[selectedCountry].confirmed).length - 1
                  ]
                }
                deaths={
                  Object.values(rowData[selectedCountry].dead)[
                    Object.values(rowData[selectedCountry].dead).length - 1
                  ]
                }
              />
            )}
        </Paper>
      </Grid> */}
      {/* Recent Orders */}
      {/* <Grid item xs={12}>
    <Paper className={classes.paper}>
      <Orders />
    </Paper>
  </Grid> */}
    </Dashboard>
  );
});

export default ComparisonPage;
