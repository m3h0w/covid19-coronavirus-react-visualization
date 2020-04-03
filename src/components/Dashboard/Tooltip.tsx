import React from 'react';
import { LabelFormatter, Tooltip } from 'recharts';
import numberWithCommas from '../../utils/numberWithCommas';

const getTooltip = (labelFormatter?: LabelFormatter) => (
  <Tooltip
    offset={-120}
    labelFormatter={labelFormatter}
    formatter={numberWithCommas}
    allowEscapeViewBox={{ x: true, y: true }}
  />
);

export default getTooltip;
