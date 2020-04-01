import axios from "axios";

export const getConfirmedFileContent = async (): Promise<string> => {
  const result = await axios.get(
    "https://www.soothsawyer.com/wp-content/uploads/2020/03/time_series_19-covid-Confirmed.csv"
  );
  return result.data;
};

export const getDeathsFileContent = async (): Promise<string> => {
  const result = await axios.get(
    "https://www.soothsawyer.com/wp-content/uploads/2020/03/time_series_19-covid-Deaths.csv"
  );
  return result.data;
};
