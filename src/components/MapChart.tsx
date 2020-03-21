import React, { useEffect, useState } from 'react';
import { csv } from 'd3-request';
import { scaleLog } from 'd3-scale';
import pink from '@material-ui/core/colors/pink';
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  ZoomableGroup,
} from 'react-simple-maps';
import dataCsvUrl from '../data/vulnerability.csv';
import { useTheme } from '@material-ui/core/styles';
import useDataStore from '../data/dataStore';
import { observer } from 'mobx-react-lite';
import { Moment } from 'moment';
import geoUrl from '../data/worldMap.json';
import { useHistory } from 'react-router';
import { showInfoSnackBar } from './Snackbar';
import { useStateAndLocalStorage } from 'persistence-hooks';
import { Fade, Theme } from '@material-ui/core';
import { DataStore } from '../data/dataStore';

const rounded = (num) => {
  if (num > 1000000000) {
    return Math.round(num / 100000000) / 10 + 'Bn';
  } else if (num > 1000000) {
    return Math.round(num / 100000) / 10 + 'M';
  } else {
    return Math.round(num / 100) / 10 + 'K';
  }
};

const getMatchingCountryKey = (dataStore: DataStore, geo) => {
  for (const key of Object.keys(geo.properties)) {
    const countryName = geo.properties[key];
    if (dataStore.possibleCountries.includes(countryName)) {
      return countryName;
    }
  }
  return undefined;
};

// const scaleWithDomain = ;
const getColorsScale = (dataType, theme: Theme) => {
  switch (dataType) {
    case 'confirmed':
      return scaleLog()
        .domain([1, 10000, 100000])
        .range(['#F2EAEA', theme.palette.primary.dark, '#000']);
    case 'dead':
      return scaleLog()
        .domain([1, 10000, 15000])
        .range(['#F2EAEA', '#222', '#000']);
  }
};

const MapChart = observer(
  ({
    date,
    setTooltipContent,
    dataType,
  }: {
    date: string;
    setTooltipContent: (content: string) => void;
    dataType: 'confirmed' | 'dead';
  }) => {
    const theme = useTheme();
    const dataStore = useDataStore();
    const history = useHistory();
    const colorScale = getColorsScale(dataType, theme);
    const [shownSnackbar, setShownSnackbar] = useStateAndLocalStorage(
      false,
      'shownMapClickSnackbar'
    );
    const routeChange = (country: string) => {
      history.push(`/dashboard/${country}`);
    };

    const getScale = () => {
      if (window.innerWidth < 400) {
        return 90;
      }
      if (window.innerHeight < 400) {
        return 120;
      }
      return 150;
    };

    return (
      <ComposableMap data-tip=''>
        <ZoomableGroup zoom={1}>
          <Graticule stroke='#E4E5E6' strokeWidth={0.5} />
          {/* {dataStore.ready && ( */}
          <Fade in={dataStore.ready} timeout={1000}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryKey = getMatchingCountryKey(dataStore, geo);
                  const d = dataStore.getCountryData(countryKey);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        const { NAME, POP_EST } = geo.properties;
                        if (d && d[dataType] && d[dataType][date]) {
                          setTooltipContent(`${NAME} — ${d[dataType][date]} ${dataType}`);
                        } else {
                          setTooltipContent(`${NAME} — 0 ${dataType}`);
                        }

                        if (!shownSnackbar) {
                          showInfoSnackBar(
                            'Click on a country to go directly to its dashboard 💨',
                            3000
                          );
                          setShownSnackbar(true);
                        }
                      }}
                      onMouseLeave={() => {
                        setTooltipContent('');
                      }}
                      onClick={() => {
                        routeChange(countryKey);
                      }}
                      style={{
                        default: {
                          transition: 'fill 0.6s linear',
                          fill:
                            d && d[dataType] && d[dataType][date]
                              ? colorScale(d[dataType][date])
                              : '#F4EEEE',

                          outline: 'none',
                        },
                        hover: {
                          fill: theme.palette.secondary.main,
                          outline: 'none',
                          cursor: 'pointer',
                        },
                        pressed: {
                          fill: '#E42',
                          outline: 'none',
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </Fade>
          {/* )} */}
        </ZoomableGroup>
      </ComposableMap>
    );
  }
);

export default MapChart;
