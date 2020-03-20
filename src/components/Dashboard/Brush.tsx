import React from 'react';
import { Brush, TickFormatterFunction } from 'recharts';

interface IProps {
  color: string;
  tickFormatter?: TickFormatterFunction;
  data: any;
  children: () => JSX.Element;
  dataKey?: string;
}

const getBrush = ({ color, tickFormatter, data, children, dataKey = 'timestamp' }: IProps) => (
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
