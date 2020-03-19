import React from 'react';
import { LabelFormatter, Tooltip } from 'recharts';

const getTooltip = (labelFormatter?: LabelFormatter = undefined) => (
  <Tooltip
    offset={-120}
    labelFormatter={labelFormatter}
    allowEscapeViewBox={{ x: true, y: true }}
  />
);

export default getTooltip;
