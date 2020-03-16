import React, { useEffect, useState } from 'react';
import { csv } from 'd3-request';
import { scaleLinear } from 'd3-scale';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from 'react-simple-maps';
import dataCsvUrl from '../data/vulnerability.csv';
import { useTheme } from '@material-ui/core/styles';

const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';

const MapChart = () => {
  const [data, setData] = useState([]);
  const theme = useTheme();

  const colorScale = scaleLinear()
    .domain([0.29, 0.68])
    .range([theme.palette.primary.dark, theme.palette.primary.light]);

  useEffect(() => {
    csv(dataCsvUrl, (err, data) => {
      if (err) {
        console.error(err);
      }
      console.log({ data });
      setData(data);
    });
  }, []);

  return (
    <ComposableMap
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 147,
      }}
    >
      <Sphere stroke='#E4E5E6' strokeWidth={0.5} />
      <Graticule stroke='#E4E5E6' strokeWidth={0.5} />
      {data.length > 0 && (
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const d = data.find((s) => s.ISO3 === geo.properties.ISO_A3);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={d ? colorScale(d['2017']) : '#F5F4F6'}
                />
              );
            })
          }
        </Geographies>
      )}
    </ComposableMap>
  );
};

export default MapChart;
