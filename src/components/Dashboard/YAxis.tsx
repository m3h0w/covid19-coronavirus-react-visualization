import React from 'react';
import { LabelProps, YAxis } from 'recharts';

const getYAxis = (
  yLabel: string,
  logScale: boolean = false,
  hide: boolean = false,
  orientation?: 'left' | 'right' | undefined,
  mirror: boolean = true,
  allowDecimals: boolean = true,
  domain?: [any, any]
) => {
  const isSmall = window.innerWidth < 600;

  const yaxisDefaults = {
    allowDataOverflow: true,
    axisLine: false,
    tickLine: false,
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
      hide={hide}
      scale={logScale ? 'log' : undefined}
      label={!isSmall ? getYLabelConfig(yLabel) : undefined}
      tick={{ dx: !isSmall ? 17 : 0, fontSize: isSmall ? 12 : 15 }}
      yAxisId={orientation}
      orientation={orientation}
      mirror={mirror}
      allowDecimals={allowDecimals}
      domain={
        !domain
          ? logScale
            ? ['10', (dataMax) => dataMax * 2]
            : [0, (dataMax) => Math.ceil(dataMax * 1.1)]
          : domain
      }
      {...yaxisDefaults}
    />
  );
};

export default getYAxis;
