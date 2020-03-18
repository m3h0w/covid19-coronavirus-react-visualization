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

const rounded = (num) => {
  if (num > 1000000000) {
    return Math.round(num / 100000000) / 10 + 'Bn';
  } else if (num > 1000000) {
    return Math.round(num / 100000) / 10 + 'M';
  } else {
    return Math.round(num / 100) / 10 + 'K';
  }
};

const getMatchingCountryKey = (dataStore, geo) => {
  for (const key of Object.keys(geo.properties)) {
    const countryName = geo.properties[key];
    if (dataStore.possibleCountries.includes(countryName)) {
      return countryName;
    }
  }
  return undefined;
};

const scaleWithDomain = scaleLog().domain([1, 2000]);

const MapChart = observer(
  ({ date, setTooltipContent }: { date: string; setTooltipContent: (content: string) => void }) => {
    const theme = useTheme();
    const dataStore = useDataStore();
    const history = useHistory();
    const colorScale = scaleWithDomain.range([pink[50], theme.palette.primary.dark]);
    const [shownSnackbar, setShownSnackbar] = useStateAndLocalStorage(
      false,
      'shownMapClickSnackbar'
    );
    const routeChange = (country: string) => {
      history.push(`/dashboard/${country}`);
    };

    // console.log({ date });
    // console.log(dataStore.ready);

    return (
      <ComposableMap
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ width: '100%', height: '100%' }}
        projectionConfig={{
          rotate: [-11, 0, 0],
          scale: 200,
        }}
        data-tip=''
      >
        <ZoomableGroup zoom={1}>
          <Sphere stroke='#E4E5E6' strokeWidth={0.5} />
          <Graticule stroke='#E4E5E6' strokeWidth={0.5} />
          {dataStore.ready && (
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
                        if (d?.confirmed && d.confirmed[date]) {
                          setTooltipContent(`${NAME} — ${d.confirmed[date]} cases`);
                        } else {
                          setTooltipContent(`${NAME} — 0 cases`);
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
                          fill:
                            d?.confirmed && d.confirmed[date]
                              ? colorScale(d.confirmed[date])
                              : '#F5F4F6',

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
          )}
        </ZoomableGroup>
      </ComposableMap>
    );
  }
);

export default MapChart;
