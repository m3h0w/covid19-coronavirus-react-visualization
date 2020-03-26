import React, { useEffect, useState, FC } from 'react';
import { useTheme } from '@material-ui/core/styles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  TickFormatterFunction,
  CartesianGrid,
} from 'recharts';
import Title from './Title';
import moment, { Moment } from 'moment';
import getBrush from './Brush';
import { momentToFormat, FIRST_DATE } from '../../utils/getDatesFromDataRow';
import getYAxis from './YAxis';
import getTooltip from './Tooltip';
import ReactCountryFlag from 'react-country-flag';
import countryToCode from '../../utils/countryToCode';

export type Row = {
  [key in Column]: string;
};

type Column = 'Province/State' | 'Country/Region' | 'Lat' | 'Long' | string;

interface IProps {
  rowData: { confirmed: Row; dead: Row };
  dates: Moment[];
  showingDataFor: string;
}

const Chart: FC<IProps> = ({ rowData, dates, showingDataFor }) => {
  const theme = useTheme();
  const [firstCaseDate, setFirstCaseDate] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    if (rowData && rowData.confirmed && rowData.dead) {
      let lastZeroDay: Moment | undefined = moment(FIRST_DATE);
      const d = dates
        .map((date) => {
          const confirmedCases = Number(rowData.confirmed[momentToFormat(date)]);
          const deaths = Number(rowData.dead[momentToFormat(date)]);

          if (lastZeroDay?.isSame(moment(FIRST_DATE)) && confirmedCases > 0) {
            lastZeroDay = date.clone();
            lastZeroDay.subtract(2, 'days');
          }
          return {
            confirmedCases,
            deaths,
            time: date.unix(),
          };
        })
        .filter((el) => {
          return moment(el.time * 1000).isAfter(lastZeroDay);
        });
      setData(d);
      setFirstCaseDate(lastZeroDay);
    }
  }, [rowData]);

  const getFormattedLine = (dataKey, name, stroke?: string) => (
    <Line
      type='monotone'
      dataKey={dataKey}
      name={name}
      stroke={stroke || theme.palette.primary.main}
      dot={true}
      strokeWidth={2}
    />
  );

  const lines = [
    getFormattedLine('confirmedCases', 'Confirmed cases'),
    getFormattedLine('deaths', 'Deaths', '#000'),
  ];

  const brush = getBrush({
    data,
    color: theme.palette.text.secondary,
    tickFormatter: formatXAxis,
    dataKey: 'time',
    children: (
      <LineChart>
        <YAxis hide domain={[0, 'auto']} />
        {lines}
      </LineChart>
    ),
  });

  if (!data) {
    return null;
  }

  return (
    <>
      <Title>
        Cases & Deaths
        {showingDataFor && `: ${showingDataFor} `}
        <ReactCountryFlag
          countryCode={countryToCode(showingDataFor)}
          svg
          style={{ marginTop: -5 }}
        />
      </Title>
      <ResponsiveContainer width={'100%'}>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        >
          <CartesianGrid strokeDasharray='1 3' />
          <XAxis
            angle={-15}
            dataKey='time'
            stroke={theme.palette.text.secondary}
            tickFormatter={formatXAxis}
          />
          {getYAxis('No. of cases & deaths')}
          {lines}
          {brush}
          {getTooltip(formatXAxis)}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

const TIME_FORMAT = 'MMM Do';
const formatXAxis: TickFormatterFunction = (tickItem: number) =>
  moment(tickItem * 1000).format(TIME_FORMAT);

export default Chart;
