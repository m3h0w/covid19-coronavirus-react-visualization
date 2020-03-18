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
import {
  useStateAndLocalStorage,
  useStateAndCookie,
  useStateAndSessionStorage,
} from 'persistence-hooks';
import useDataStore from '../data/dataStore';
import { observer } from 'mobx-react-lite';
import Colors from '../utils/colors';
import createPersistedState from '../utils/memoryState';
import { useHistory, RouteComponentProps } from 'react-router';

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
  clipWrapper: {
    display: 'flex',
  },
}));

interface IRowData {
  confirmed: Row | undefined;
  dead: Row | undefined;
}

function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace('#', '');
  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
}

const CustomChip = ({ handleDelete, label, backgroundColor }) => (
  <Chip
    style={{ margin: 5, backgroundColor, color: getContrastYIQ(backgroundColor) }}
    // avatar={<Avatar alt='Natacha' src='/static/images/avatar/1.jpg' />}
    label={label}
    onDelete={handleDelete}
  />
);

let colorsHelper = new Colors();
const useMemoryStateA = createPersistedState();
const useMemoryStateB = createPersistedState();

const ComparisonPage: FC<RouteComponentProps> = observer((props) => {
  const classes = useStyles();
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const dataStore = useDataStore();
  const possibleCountries = dataStore.possibleCountries;
  const [colors, setColors] = useMemoryStateA<{ [country: string]: string }>({});
  const [data, setData] = useMemoryStateB<{ [key: string]: IRowData }>({});
  const history = useHistory();

  const generateNewColors = useCallback(() => {
    if (data && Object.keys(data).length) {
      colorsHelper = new Colors();
      const newColors = {};
      Object.keys(data).forEach((key) => {
        newColors[key] = colorsHelper.getRandomColor();
      });
      setColors(newColors);
    }
  }, [setColors, data]);

  const addCountry = useCallback(
    (country) => {
      if (dataStore.ready) {
        setData((oldData) => {
          return { ...oldData, [country]: dataStore.getCountryData(country) };
        });
        setColors((oldColors) => {
          return { ...oldColors, [country]: colorsHelper.getRandomColor() };
        });
      }
    },
    [dataStore, setData, setColors]
  );

  useEffect(() => {
    if (dataStore.ready && !Object.keys(data).length && !props.match.params.country) {
      addCountry('Italy');
    }
  }, [addCountry, dataStore.ready]);

  useEffect(() => {
    const countryFromUrl = props.match.params.country;
    if (countryFromUrl) {
      history.push(`/comparison`);
      addCountry(countryFromUrl);
    }
  }, [props.match.params.country, history, addCountry]);

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
              Object.keys(data).map((country: string, i: number) => (
                <CustomChip
                  key={i}
                  handleDelete={() => {
                    setData((prevRowData) => {
                      const newRowData = { ...prevRowData };
                      delete newRowData[country];
                      return newRowData;
                    });
                  }}
                  label={country}
                  backgroundColor={colors[country]}
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
            colors={colors}
            generateNewColors={generateNewColors}
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
