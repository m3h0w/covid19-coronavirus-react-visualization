import { createContext, useContext } from 'react';
import { observable, computed } from 'mobx';
import { Row } from '../components/Dashboard/MultiChart';
import { csv } from 'd3-request';
import confirmedCsvUrl from '../data/confirmed.csv';
import deathsCsvUrl from '../data/deaths.csv';
import confirmedGlobalCsvUrl from '../data/confirmed_global.csv';
import deathsGlobalCsvUrl from '../data/deaths_global.csv';
import fetchCsv from 'utils/downloadCsv';
import { getDatesFromDataRow, momentToFormat } from '../utils/getDatesFromDataRow';
import stateNames from 'data/stateNames.json';
import { US_NAME, SOUTH_KOREA } from '../utils/consts';
import { showInfoSnackBar } from '../components/Snackbar';
import last from 'utils/last';

const USE_LOCAL_DATA = true;

interface ICountryData {
  confirmed: Row | undefined;
  dead: Row | undefined;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

const namesMap = {
  US: US_NAME,
  'Korea, South': SOUTH_KOREA,
};
const swapName = (name: string): string => {
  if (!Object.keys(namesMap).includes(name)) {
    throw new Error(`Tried to swap a country that doesn't exist in the namesMap`);
  }
  return namesMap[name];
};

// _.groupBy
function groupBy(arr: any[], key: string) {
  let reducer = (grouped: object, item: object) => {
    let group_value = item[key];
    if (
      item[STATE_KEY] === 'Recovered' ||
      item[STATE_KEY] === 'Confirmed' ||
      item[STATE_KEY] === 'Deaths'
    ) {
      return grouped;
    }

    if (Object.keys(namesMap).includes(group_value)) {
      group_value = swapName(group_value);
    }
    if (!grouped[group_value]) {
      grouped[group_value] = {};
    }

    Object.keys(item).forEach((rowKey) => {
      let v = item[rowKey];
      if (!grouped[group_value][rowKey]) {
        grouped[group_value][rowKey] = 0;
      }
      if (v && isNumber(v)) {
        // if (group_value === US_NAME) {
        //   if (!Object.values(stateNames).includes(item[STATE_KEY])) {
        //     return grouped;
        //   }
        // }
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

export const COUNTRY_KEY = 'Country/Region';
export const STATE_KEY = 'Province/State';

export class DataStore {
  @observable public confirmedByRegion: GroupedData | undefined = undefined;
  @observable public confirmedByRegionOld: GroupedData | undefined = undefined;
  @observable public deadByRegion: GroupedData | undefined = undefined;
  @observable public deadByRegionOld: GroupedData | undefined = undefined;
  @observable public confirmedByCountry: GroupedData | undefined = undefined;
  @observable public deadByCountry: GroupedData | undefined = undefined;

  constructor() {
    if (USE_LOCAL_DATA) {
      csv(confirmedCsvUrl, (err, data: any) => {
        if (data) {
          this.confirmedByRegionOld = groupBy(data, STATE_KEY);
        } else {
          throw new Error(`Data wasn't loaded correctly`);
        }
      });

      csv(deathsCsvUrl, (err, data: any) => {
        if (data) {
          this.deadByRegionOld = groupBy(data, STATE_KEY);
        } else {
          throw new Error(`Data wasn't loaded correctly`);
        }
      });

      csv(confirmedGlobalCsvUrl, (err, data: any) => {
        if (data) {
          this.confirmedByCountry = groupBy(data, COUNTRY_KEY);
          this.confirmedByRegion = groupBy(data, STATE_KEY);
        } else {
          throw new Error(`Data wasn't loaded correctly`);
        }
      });

      csv(deathsGlobalCsvUrl, (err, data: any) => {
        if (data) {
          this.deadByCountry = groupBy(data, COUNTRY_KEY);
          this.deadByRegion = groupBy(data, STATE_KEY);
        } else {
          throw new Error(`Data wasn't loaded correctly`);
        }
      });
    }
    // } else {
    //   fetchCsv('confirmed', (data: Row[]) => {
    //     if (data) {
    //       this.confirmedByRegion = groupBy(data, STATE_KEY);
    //       this.confirmedByCountry = groupBy(data, COUNTRY_KEY);
    //     } else {
    //       throw new Error(`Data wasn't loaded correctly`);
    //     }
    //   });

    //   fetchCsv('dead', (data: Row[]) => {
    //     if (data) {
    //       this.deadByRegion = groupBy(data, STATE_KEY);
    //       this.deadByCountry = groupBy(data, COUNTRY_KEY);
    //     } else {
    //       throw new Error(`Data wasn't loaded correctly`);
    //     }
    //   });
    // }
  }

  @computed get totalConfirmedCasesArray():
    | Array<{ time: number; totalCases: number }>
    | undefined {
    return this.confirmedCasesArray?.map((el) => {
      return {
        time: el.time,
        totalCases: Object.keys(el).reduce((acc: number, key: string) => {
          if (key !== 'time') {
            acc = acc + el[key];
          }
          return acc;
        }, 0),
      };
    });
  }

  @computed get totalDeathsArray(): Array<{ time: number; totalDeaths: number }> | undefined {
    return this.deathsArray?.map((el) => {
      return {
        time: el.time,
        totalDeaths: Object.keys(el).reduce((acc: number, key: string) => {
          if (key !== 'time') {
            acc = acc + el[key];
          }
          return acc;
        }, 0),
      };
    });
  }

  @computed get dayOf100CasesByCountry() {
    const threshold = 100;
    if (!this.ready) {
      return undefined;
    }
    return this.possibleCountries.reduce((acc, country) => {
      const countryData = this.getCountryData(country);
      const values = this.datesConverted.map((date) => countryData?.confirmed[date]);
      const day = values.findIndex((v) => v > threshold);
      acc[country] = day !== -1 ? day : undefined;
      return acc;
    }, {});
  }

  public dataForAfter100Cases(type: 'confirmed' | 'dead', countries: string[]) {
    if (!this.ready) {
      return undefined;
    }
    return this.dates
      ?.map((_, i: number) => {
        const d = {
          time: i,
        };
        this.possibleCountries.forEach((country) => {
          const dayOf100Cases = this.dayOf100CasesByCountry[country];
          if (dayOf100Cases === undefined) {
            return;
          }
          const index = dayOf100Cases + i;
          if (index <= this.dates.length - 1) {
            const date = this.dates[index];
            if (countries.includes(country)) {
              const value = this.getCountryData(country)[type][momentToFormat(date)];
              d[country] = value;
            }
          }
        });
        return d;
      })
      .filter((el) =>
        Object.keys(el).some((k) => {
          if (k === 'time') {
            return undefined;
          }
          return el[k];
        })
      );
  }

  @computed get confirmedCasesArray() {
    return this.dates?.map((date) => {
      const d = {
        time: date.unix(),
      };
      this.possibleCountries.forEach((country) => {
        d[country] = this.confirmedByCountry[country][momentToFormat(date)];
      });
      return d;
    });
  }

  @computed get deathsArray() {
    return this.dates?.map((date) => {
      const d = {
        time: date.unix(),
      };
      this.possibleCountries.forEach((country) => {
        d[country] = this.deadByCountry[country][momentToFormat(date)];
      });
      return d;
    });
  }

  public getDataArrayWithTime(type: 'confirmed' | 'dead', countries: string[]) {
    return this.dates?.map((date, i: number) => {
      const d = {
        time: date.unix(),
        number: i,
      };
      this.possibleCountries.forEach((country) => {
        if (countries.includes(country)) {
          const value = this.getCountryData(country)[type][momentToFormat(date)];
          d[country] = value;
        }
      });
      return d;
    });
  }

  public getDataArrayWithTimeOffset(type: 'confirmed' | 'dead', countries: string[]) {
    return this.dates?.map((date, i: number) => {
      const d = {
        time: date.unix(),
      };
      this.possibleCountries.forEach((country) => {
        if (countries.includes(country)) {
          const value = this.getCountryData(country)[type][momentToFormat(date)];
          d[country] = value;
        }
      });
      return d;
    });
  }

  public getRegionData = (region: string) => {
    if (
      !this.confirmedByRegionOld ||
      !this.deadByRegionOld ||
      !this.confirmedByRegion ||
      !this.deadByRegion
    ) {
      return;
    }
    if (Object.keys(this.confirmedByRegion).includes(region)) {
      return {
        confirmed: this.confirmedByRegion[region],
        dead: this.deadByRegion[region],
      };
    }
    return {
      confirmed: this.confirmedByRegionOld[region],
      dead: this.deadByRegionOld[region],
    };
  };

  public getPossibleRegionsByCountry = (country: string) => {
    return this.possibleRegions.filter((region) => {
      if (country === US_NAME) {
        if (!Object.values(stateNames).includes(region)) {
          return false;
        }
      }
      return this.getRegionData(region)?.confirmed[COUNTRY_KEY] === country;
    });
  };

  public getCountryData = (country: string) => {
    if (!this.confirmedByCountry || !this.deadByCountry) {
      return;
    }
    return {
      confirmed: this.confirmedByCountry[country],
      dead: this.deadByCountry[country],
    };
  };

  @computed get possibleCountries() {
    if (this.ready && this.confirmedByCountry) {
      return Object.keys(this.confirmedByCountry).sort();
    }
    return [];
  }

  @computed get countriesWithOver100Cases() {
    if (this.ready && this.confirmedByCountry) {
      return Object.keys(this.confirmedByCountry)
        .filter((key) => this.dayOf100CasesByCountry[key] !== undefined)
        .sort();
    }
    return [];
  }

  @computed get possibleRegions() {
    if (this.ready && this.confirmedByRegionOld) {
      return Object.keys(this.confirmedByRegionOld).sort();
    }
    return [];
  }

  @computed get regionDates() {
    if (this.ready && this.confirmedByRegionOld) {
      for (const countryName of Object.keys(this.confirmedByRegionOld)) {
        const row = this.confirmedByRegionOld[countryName];
        const dates = getDatesFromDataRow(row);
        if (dates) {
          return dates;
        }
      }
    }
    return undefined;
  }

  @computed get regionDatesConverted() {
    if (this.regionDates) {
      return this.regionDates.map(momentToFormat);
    }

    return undefined;
  }

  @computed get dates() {
    if (this.ready && this.confirmedByCountry) {
      for (const countryName of Object.keys(this.confirmedByCountry)) {
        const row = this.confirmedByCountry[countryName];
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

  @computed get ready(): boolean {
    return Boolean(this.confirmedByCountry) && Boolean(this.deadByCountry);
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
