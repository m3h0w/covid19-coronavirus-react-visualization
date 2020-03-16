import { createContext, useContext } from 'react';
import { decorate, observable, computed, intercept, observe } from 'mobx';
import { Moment } from 'moment';
import { Row } from '../components/Dashboard/MultiChart';
import { csv } from 'd3-request';
import confirmedCsvUrl from '../data/confirmed.csv';
import deathsCsvUrl from '../data/deaths.csv';

interface ICountryData {
  confirmed: Row | undefined;
  dead: Row | undefined;
}

export class DataStore {
  @observable public dates: Moment[] = [];
  @observable public confirmedCsv: Row[] | undefined = undefined;
  @observable public deadCsv: Row[] | undefined = undefined;

  constructor() {
    csv(confirmedCsvUrl, (err, data: Row[]) => {
      this.confirmedCsv = data;
    });

    csv(deathsCsvUrl, (err, data: Row[]) => {
      this.deadCsv = data;
    });
  }

  public getCountryData = (country: string) => {
    const toReturn: ICountryData = {
      confirmed: undefined,
      dead: undefined,
    };
    if (this.confirmedCsv) {
      this.confirmedCsv.forEach((row: Row) => {
        if (row['Country/Region'] === country) {
          toReturn.confirmed = row;
        }
      });
    }

    if (this.deadCsv) {
      this.deadCsv.forEach((row: Row) => {
        if (row['Country/Region'] === country) {
          toReturn.dead = row;
        }
      });
    }

    return toReturn;
  };

  @computed get possibleCountries() {
    if (this.confirmedCsv) {
      return [...new Set(this.confirmedCsv.map((row: Row) => row['Country/Region']))].sort();
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
