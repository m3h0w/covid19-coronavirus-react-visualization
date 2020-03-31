import "source-map-support/register";
import { handleSynchronize } from "./handle-synchronize";
import {
  getConfirmedFileContent,
  getDeathsFileContent
} from "./covid-file-contents";

export const handler = async (): Promise<void> => {
  try {
    await handleSynchronize(getConfirmedFileContent, getDeathsFileContent)();
  } catch (e) {
    console.log(e);
    throw e;
  }
};
