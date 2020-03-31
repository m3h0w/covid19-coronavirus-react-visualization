import { createPullRequestWithCovidData } from "./create-pull-request-for-covid-data";
import { getGitHubAccessToken } from "./environment-variables";

export const handleSynchronize = (
  getConfirmedFileContent: () => Promise<string>,
  getDeathsFileContent: () => Promise<string>
) => async (): Promise<void> => {
  const getConfirmedFileContentPromise = getConfirmedFileContent();
  const getDeathsFileContentPromise = getDeathsFileContent();
  await createPullRequestWithCovidData(getGitHubAccessToken)(
    await getConfirmedFileContentPromise,
    await getDeathsFileContentPromise
  );
};
