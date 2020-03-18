import React from 'react';
import { LabelProps, YAxis } from 'recharts';

const getYAxis = (yLabel: string) => {
  const isSmall = window.innerWidth < 600;

  const yaxisDefaults = {
    allowDataOverflow: true,
    axisLine: false,
    tickLine: false,
    allowDecimals: true,
    mirror: true,
    type: 'number' as 'number' | 'category' | undefined,
  };

  const getYLabelConfig = (yLabel: string): LabelProps => {
    return {
      value: yLabel,
      angle: -90,
      dx: 7,
      position: 'insideLeft',
      style: { textAnchor: 'middle', fontSize: '80%' },
    };
  };
  return (
    <YAxis
      label={!isSmall ? getYLabelConfig(yLabel) : undefined}
      tick={{ dx: !isSmall ? 17 : 0, fontSize: isSmall ? 12 : 15 }}
      // tickFormatter={format}
      {...yaxisDefaults}
      domain={[0, 'auto']}
    />
  );
};

export default getYAxis;
