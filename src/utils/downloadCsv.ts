import { csv } from 'd3-request';

const deadUrl =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv';
const confirmedUrl =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv';

const fetchCsv = (dataType: 'confirmed' | 'dead', callback: (data: any) => void) => {
  const url = {
    dead: deadUrl,
    confirmed: confirmedUrl,
  }[dataType];
  csv(url, (err, data) => {
    if (err) {
      console.error(err);
      callback(undefined);
    }

    callback(data);
  });
};

export default fetchCsv;
