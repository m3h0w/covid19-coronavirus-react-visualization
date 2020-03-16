import { createContext, useContext } from 'react';
import { decorate, observable, computed, intercept, observe } from 'mobx';
import { Moment } from 'moment';
import { Row } from '../components/Dashboard/MultiChart';
import { csv } from 'd3-request';
import confirmedCsvUrl from '../data/confirmed.csv';
import deathsCsvUrl from '../data/deaths.csv';
import fetchCsv from 'utils/downloadCsv';

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

    if (group_value === 'France') {
      console.log('item', item);
      console.log(grouped['France']);
    }

    Object.keys(item).forEach((rowKey) => {
      if (!grouped[group_value][rowKey]) {
        grouped[group_value][rowKey] = 0;
      }
      if (item[rowKey] && isNumber(item[rowKey])) {
        grouped[group_value][rowKey] += parseFloat(item[rowKey]);
      } else {
        if (group_value === 'France') {
          console.log(item[rowKey]);
        }
        grouped[group_value][rowKey] = item[rowKey];
      }
    });

    return grouped;
  };
  return arr.reduce(reducer, {});
}

export class DataStore {
  @observable public dates: Moment[] = [];
  @observable public confirmedCsv: Row[] | undefined = undefined;
  @observable public deadCsv: Row[] | undefined = undefined;

  constructor() {
    csv(confirmedCsvUrl, (err, data: Row[]) => {
      this.confirmedCsv = groupBy(data, 'Country/Region');
    });

    csv(deathsCsvUrl, (err, data: Row[]) => {
      this.deadCsv = groupBy(data, 'Country/Region');
    });

    // fetchCsv('confirmed', (data: Row[]) => {
    //   console.log(groupBy(data, 'Country/Region'));
    //   this.confirmedCsv = data;
    // });

    // fetchCsv('dead', (data: Row[]) => {
    //   this.deadCsv = data;
    // });
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
