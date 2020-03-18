import React, { useEffect, useState } from 'react';
import { csv } from 'd3-request';
import { scaleLog } from 'd3-scale';
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

const MapChart = observer(
  ({ date, setTooltipContent }: { date: string; setTooltipContent: (content: string) => void }) => {
    const theme = useTheme();
    const dataStore = useDataStore();

    const colorScale = scaleLog()
      .domain([5, 2000])
      .range([theme.palette.primary.light, theme.palette.primary.dark]);

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
          {dataStore.possibleCountries.length > 0 && (
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
                      }}
                      onMouseLeave={() => {
                        setTooltipContent('');
                      }}
                      onClick={() => {
                        const { NAME, POP_EST } = geo.properties;
                        if (d?.confirmed && d.confirmed[date]) {
                          setTooltipContent(`${NAME} — ${d.confirmed[date]}`);
                        }
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
