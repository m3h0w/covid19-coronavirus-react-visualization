const extractKeyFromNestedObj = (obj: object, keyToExtract: string) =>
  Object.keys(obj).reduce((acc: { [countryKey: string]: number } | {}, countryKey: string) => {
    acc[countryKey] = obj[countryKey][keyToExtract];
    return acc;
  }, {});

export default extractKeyFromNestedObj;
