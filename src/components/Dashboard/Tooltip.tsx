import React from 'react';
import { LabelFormatter, Tooltip, TooltipFormatter } from 'recharts';
import numberWithCommas from '../../utils/numberWithCommas';

const getTooltip = (labelFormatter?: LabelFormatter, formatter?: TooltipFormatter) => (
  <Tooltip
    offset={-120}
    labelFormatter={labelFormatter}
    formatter={!formatter ? numberWithCommas : formatter}
    allowEscapeViewBox={{ x: true, y: true }}
  />
);

export default getTooltip;
