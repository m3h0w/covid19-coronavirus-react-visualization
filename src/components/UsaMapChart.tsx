import React, { useMemo, useCallback } from 'react';
import { geoCentroid } from 'd3-geo';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
  Graticule,
} from 'react-simple-maps';
import geoUrl from 'data/statesMap.json';
import allStates from 'data/allstates.json';
import { DataStore } from '../data/dataStore';
import { useTheme } from '@material-ui/core/styles';
import useDataStore from '../data/dataStore';
import { useHistory } from 'react-router';
import { observer } from 'mobx-react-lite';
import { showInfoSnackBar } from './Snackbar';
import { scaleLog } from 'd3-scale';
import { useStateAndLocalStorage } from 'persistence-hooks';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { Fade } from '@material-ui/core';
import { getColorsScale } from './MapChart';

const offsets = {
  VT: [50, -8],
  NH: [34, 2],
  MA: [30, -1],
  RI: [28, 2],
  CT: [35, 10],
  NJ: [34, 1],
  DE: [33, 0],
  MD: [47, 10],
  DC: [49, 21],
};

const getMatchingStateKey = (dataStore: DataStore, geo) => {
  for (const key of Object.keys(geo.properties)) {
    const regionName = geo.properties[key];
    if (dataStore.possibleRegions.includes(regionName)) {
      return regionName;
    }
  }
  return undefined;
};

const UsaMapChart = observer(
  ({
    date,
    setTooltipContent,
    dataType,
    style,
    onClick,
    selectedRegion,
  }: {
    date: string;
    setTooltipContent: (content: string) => void;
    dataType: 'confirmed' | 'dead';
    style: CSSProperties;
    onClick: () => void;
    selectedRegion: string;
  }) => {
    const theme = useTheme();
    const dataStore = useDataStore();
    const history = useHistory();
    const colorScale = getColorsScale(dataType, theme);
    const [shownSnackbar, setShownSnackbar] = useStateAndLocalStorage(
      false,
      'shownMapClickSnackbar'
    );

    const getDefaultFill = useCallback(
      (stateKey) => {
        if (selectedRegion === stateKey) {
          return theme.palette.secondary.main;
        }

        const d = dataStore.getRegionData(stateKey);
        return d && d[dataType] && d[dataType][date] ? colorScale(d[dataType][date]) : '#F4EEEE';
      },
      [selectedRegion, dataStore, dataType, date]
    );

    return useMemo(
      () => (
        <ComposableMap projection='geoAlbersUsa' style={style} data-tip=''>
          <Graticule stroke='#D4D5D6' strokeWidth={0.5} />
          <Fade in={dataStore.ready} timeout={1000}>
            <Geographies geography={geoUrl}>
              {({ geographies }) => (
                <>
                  {geographies.map((geo) => {
                    const stateKey = getMatchingStateKey(dataStore, geo);
                    if (!stateKey) {
                      return null;
                    }
                    const d = dataStore.getRegionData(stateKey);
                    // console.log({ stateKey });
                    // console.log({ d });
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => {
                          // const { NAME, POP_EST } = geo.properties;
                          // console.log({ NAME });
                          if (d && d[dataType] && d[dataType][date]) {
                            // setTooltipContent(`${stateKey} — ${d[dataType][date]} ${dataType}`);
                          } else {
                            // setTooltipContent(`${stateKey} — 0 ${dataType}`);
                          }

                          // if (!shownSnackbar) {
                          //   showInfoSnackBar(
                          //     'Click on a country to go directly to its dashboard 💨',
                          //     3000
                          //   );
                          //   setShownSnackbar(true);
                          // }
                        }}
                        onMouseLeave={() => {
                          // setTooltipContent('');
                        }}
                        onClick={() => onClick(stateKey)}
                        style={{
                          default: {
                            transition: 'fill 0.6s linear',
                            fill: getDefaultFill(stateKey),
                            outline: 'none',
                          },
                          hover: {
                            fill: theme.palette.secondary.light,
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
                  })}
                  {geographies.map((geo) => {
                    const centroid = geoCentroid(geo);
                    const cur = allStates.find((s) => s.val === geo.id);
                    return (
                      <g key={geo.rsmKey + '-name'}>
                        {cur &&
                          centroid[0] > -160 &&
                          centroid[0] < -67 &&
                          (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                            <Marker coordinates={centroid}>
                              <text y='2' fontSize={14} textAnchor='middle'>
                                {cur.id}
                              </text>
                            </Marker>
                          ) : (
                            <Annotation
                              subject={centroid}
                              dx={offsets[cur.id][0]}
                              dy={offsets[cur.id][1]}
                            >
                              <text x={4} fontSize={14} alignmentBaseline='middle'>
                                {cur.id}
                              </text>
                            </Annotation>
                          ))}
                      </g>
                    );
                  })}
                </>
              )}
            </Geographies>
          </Fade>
        </ComposableMap>
      ),
      [date, selectedRegion]
    );
  }
);

export default UsaMapChart;
