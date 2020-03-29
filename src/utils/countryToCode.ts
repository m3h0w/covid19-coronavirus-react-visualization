import countryCodes from '../data/countryCodes.json';

const countryToCode = (country: string) => {
  let c = country;
  if (country === 'Czechia') {
    c = 'Czech Republic';
  }
  return countryCodes.find((v) => v.country_name === c.replace('*', ''))?.country_code;
};

export default countryToCode;
