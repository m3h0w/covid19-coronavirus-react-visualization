import { createContext, useContext } from 'react';
import { observable, computed } from 'mobx';
import { Row } from '../components/Dashboard/MultiChart';
import { csv } from 'd3-request';
import confirmedCsvUrl from '../data/confirmed.csv';
import deathsCsvUrl from '../data/deaths.csv';
import fetchCsv from 'utils/downloadCsv';
import { getDatesFromDataRow, momentToFormat } from '../utils/getDatesFromDataRow';

const USE_LOCAL_DATA = true;

interface ICountryData {
  confirmed: Row | undefined;
  dead: Row | undefined;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}
// _.groupBy
function groupBy(arr, key) {
  let reducer = (grouped, item) => {
    let group_value = item[key];
    if (!grouped[group_value]) {
      grouped[group_value] = {};
    }

    Object.keys(item).forEach((rowKey) => {
      if (!grouped[group_value][rowKey]) {
        grouped[group_value][rowKey] = 0;
      }
      if (item[rowKey] && isNumber(item[rowKey])) {
        grouped[group_value][rowKey] += parseFloat(item[rowKey]);
      } else {
        grouped[group_value][rowKey] = item[rowKey];
      }
    });

    return grouped;
  };
  return arr.reduce(reducer, {});
}

type GroupedData = { [countryName: string]: Row };

export const COUNTRY_KEY = 'Country/Region';

export class DataStore {
  @observable public confirmedCsv: GroupedData | undefined = undefined;
  @observable public deadCsv: GroupedData | undefined = undefined;

  constructor() {
    if (USE_LOCAL_DATA) {
      csv(confirmedCsvUrl, (err, data: any) => {
        if (data) {
          this.confirmedCsv = groupBy(data, COUNTRY_KEY);
        }
      });

      csv(deathsCsvUrl, (err, data: any) => {
        if (data) {
          this.deadCsv = groupBy(data, COUNTRY_KEY);
        }
      });
    } else {
      fetchCsv('confirmed', (data: Row[]) => {
        if (data) {
          this.confirmedCsv = groupBy(data, COUNTRY_KEY);
        }
      });

      fetchCsv('dead', (data: Row[]) => {
        if (data) {
          this.deadCsv = groupBy(data, COUNTRY_KEY);
        }
      });
    }
  }

  public getCountryData = (country: string) => {
    // const toReturn: ICountryData = {
    //   confirmed: undefined,
    //   dead: undefined,
    // };
    // if (this.confirmedCsv) {
    //   this.confirmedCsv.forEach((row: Row) => {
    //     if (row['Country/Region'] === country) {
    //       toReturn.confirmed = row;
    //     }
    //   });
    // }

    // if (this.deadCsv) {
    //   this.deadCsv.forEach((row: Row) => {
    //     if (row['Country/Region'] === country) {
    //       toReturn.dead = row;
    //     }
    //   });
    // }

    if (!this.confirmedCsv || !this.deadCsv) {
      return;
    }
    return {
      confirmed: this.confirmedCsv[country],
      dead: this.deadCsv[country],
    };
  };

  @computed get possibleCountries() {
    if (this.confirmedCsv) {
      // return [...new Set(this.confirmedCsv.map((row: Row) => row['Country/Region']))].sort();
      return Object.keys(this.confirmedCsv);
    }
    return [];
  }

  @computed get dates() {
    if (this.confirmedCsv) {
      for (const countryName of Object.keys(this.confirmedCsv)) {
        const row = this.confirmedCsv[countryName];
        console.log({ row });
        const dates = getDatesFromDataRow(row);
        if (dates) {
          return dates;
        }
      }
    }
    return undefined;
  }

  @computed get datesConverted() {
    if (this.dates) {
      return this.dates.map(momentToFormat);
    }

    return undefined;
  }
}

const getStore = () => new DataStore();

let dataStore: DataStore | undefined = getStore();
let dataStoreContext = createContext(dataStore);

export const clearSensorInfoStore = () => {
  dataStore = getStore();
  dataStoreContext = createContext(dataStore);
};

const useDataStore = () => useContext(dataStoreContext);
export default useDataStore;
