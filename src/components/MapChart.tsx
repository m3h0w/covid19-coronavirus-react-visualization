import { scaleLog } from 'd3-scale';
import { observer } from 'mobx-react-lite';
import { useStateAndLocalStorage } from 'persistence-hooks';
import React from 'react';
import { useHistory } from 'react-router';
import { ComposableMap, Geographies, Geography, Graticule, ZoomableGroup } from 'react-simple-maps';

import { Fade, Theme } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

import useDataStore, { DataStore } from '../data/dataStore';
import geoUrl from '../data/worldMap.json';
import { smUp } from '../utils/breakpoints';
import { showInfoSnackBar } from './Snackbar';
import { DataType } from '../pages/Map';
import numberWithCommas from 'utils/numberWithCommas';

const getMatchingCountryKey = (dataStore: DataStore, geo) => {
  for (const key of Object.keys(geo.properties)) {
    const countryName = geo.properties[key];
    if (dataStore.possibleCountries.includes(countryName)) {
      return countryName;
    }
  }
  return undefined;
};

export const getColorsScale = (dataType: DataType, theme: Theme) => {
  switch (dataType) {
    case 'confirmed':
      return scaleLog()
        .domain([1, 30000, 300000, 400000])
        .range(['#F2EAEA', '#FA4590', '#611835', '#000000']);
    case 'dead':
      return scaleLog().domain([1, 30000, 60000]).range(['#F2EAEA', '#222', '#000000']);
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

    // const getScale = () => {
    //   if (window.innerWidth < 400) {
    //     return 90;
    //   }
    //   if (window.innerHeight < 400) {
    //     return 120;
    //   }
    //   return 150;
    // };

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
                        // const { NAME, POP_EST } = geo.properties;
                        const { NAME } = geo.properties;
                        if (d && d[dataType] && d[dataType][date]) {
                          setTooltipContent(`${NAME} — ${numberWithCommas(d[dataType][date])}`);
                        } else {
                          setTooltipContent(`${NAME} — 0 ${dataType}`);
                        }

                        if (!shownSnackbar && smUp()) {
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
                      onClick={
                        smUp()
                          ? () => {
                              routeChange(countryKey);
                            }
                          : undefined
                      }
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
                          fill: theme.palette.secondary.dark,
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
