import { createContext, useContext } from 'react';
import { observable, computed } from 'mobx';
import { Row } from '../components/Dashboard/MultiChart';
import { csv } from 'd3-request';
import whoData from '../data/who_report.csv';
import fetchCsv from 'utils/downloadCsv';
import {
  getDatesFromDataRow,
  momentToFormat,
  momentToFormatWho,
} from '../utils/getDatesFromDataRow';
import stateNames from 'data/stateNames.json';
import { US_NAME } from '../utils/consts';
import { Moment } from 'moment';
import { getDatesFromDataRowWho } from '../utils/getDatesFromDataRow';

const USE_LOCAL_DATA = true;

interface ICountryData {
  confirmed: Row | undefined;
  dead: Row | undefined;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

const excludedCountryRegionValues = ['Globally', 'Outisde of China', 'Other', ''];
const excludedProviceStateValues = ['Confirmed', 'Deaths', 'Case on an international conveyance'];
const excludedWhoRegions = ['Territories', ''];

// _.groupBy
function groupBy(arr, key) {
  let reducer = (grouped, item) => {
    let group_value = item[key];

    if (item[COUNTRY_KEY] === 'China') {
      if (item[STATE_KEY]) {
        return grouped;
      }
      console.log([item]);
    } else {
      if (excludedProviceStateValues.includes(item[STATE_KEY])) {
        return grouped;
      }
      if (excludedCountryRegionValues.includes(item[COUNTRY_KEY]) || !item[COUNTRY_KEY]) {
        return grouped;
      }
      if (excludedWhoRegions.includes(item[WHO_REGION_KEY]) || !item[WHO_REGION_KEY]) {
        return grouped;
      }
    }

    if (group_value === 'US') {
      group_value = US_NAME;
    }
    if (!grouped[group_value]) {
      grouped[group_value] = {};
    }

    Object.keys(item).forEach((rowKey) => {
      let v = item[rowKey];
      if (!v) {
        return grouped;
      }
      if (!grouped[group_value][rowKey]) {
        grouped[group_value][rowKey] = 0;
      }
      if (v && isNumber(v)) {
        grouped[group_value][rowKey] += parseFloat(v);
      } else {
        if (v === 'US') {
          v = US_NAME;
        }
        grouped[group_value][rowKey] = v;
      }
    });

    return grouped;
  };
  return arr.reduce(reducer, {});
}

type GroupedData = { [countryName: string]: Row };

const COUNTRY_KEY = 'Country/Region';
const STATE_KEY = 'Province/States';
const WHO_REGION_KEY = 'WHO region';

export class WhoDataStore {
  @observable public whoData: any | undefined = undefined;

  constructor() {
    if (USE_LOCAL_DATA) {
      csv(whoData, (err, data: any) => {
        if (data) {
          this.whoData = groupBy(data, WHO_REGION_KEY);
          console.log(this.getDataArrayWithTime);
        } else {
          throw new Error(`Data wasn't loaded correctly`);
        }
      });
    }
  }

  @computed get getDataArrayWithTime() {
    return this.dates?.map((date: Moment, i: number) => {
      const d: { [key: string]: string | number } = {
        time: date.unix(),
        number: i,
      };
      this.possibleRegions?.forEach((region) => {
        const value = this.whoData[region][momentToFormatWho(date)];
        d[region] = value;
      });
      return d;
    });
  }

  @computed get dates() {
    if (this.ready && this.whoData) {
      for (const region of Object.keys(this.whoData)) {
        const row = this.whoData[region];
        const dates = getDatesFromDataRowWho(row);
        if (dates) {
          return dates;
        }
      }
    }
    return undefined;
  }

  @computed get datesConverted() {
    if (this.dates) {
      return this.dates.map(momentToFormatWho);
    }

    return undefined;
  }

  @computed get possibleRegions() {
    if (!this.ready) {
      return undefined;
    }
    return Object.keys(this.whoData);
  }

  @computed get ready() {
    return Boolean(this.whoData);
  }
}

const getStore = () => new WhoDataStore();

let whoDataStore: WhoDataStore | undefined = getStore();
let whoDataStoreContext = createContext(whoDataStore);

export const clearWhoDataStore = () => {
  whoDataStore = getStore();
  whoDataStoreContext = createContext(whoDataStore);
};

const useWhoDataStore = () => useContext(whoDataStoreContext);
export default useWhoDataStore;
