import React from 'react';
import { Brush } from 'recharts';

const getBrush = ({ color, tickFormatter, data, children, dataKey = 'timestamp' }) => (
  <Brush
    travellerWidth={10}
    // gap={1}
    dataKey={dataKey}
    height={30}
    stroke={color}
    tickFormatter={tickFormatter}
    data={data}
  >
    {children}
  </Brush>
);

export default getBrush;
