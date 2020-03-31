import { Octokit } from "@octokit/rest";
import createPullRequest from "octokit-create-pull-request";
import { createBranchName } from "./create-branch-name";
import { getFormattedCurrentDate } from "./get-formatted-current-date";

const OctokitWithPlugin = Octokit.plugin(createPullRequest);

export const createPullRequestWithCovidData = (
  getGitHubAccessToken: () => string
) => async (confirmedContent: string, deathsContent: string): Promise<void> => {
  const octokit = new OctokitWithPlugin({
    auth: getGitHubAccessToken()
  });
  const targetRepositoryOwner = "m3h0w";
  const targetRepositoryName = "covid19-coronavirus-react-visualization";
  const commitAndTitleMessage = "Update COVID-19 data";

  await octokit.createPullRequest({
    owner: targetRepositoryOwner,
    repo: targetRepositoryName,
    title: commitAndTitleMessage,
    head: createBranchName(getFormattedCurrentDate)(),
    changes: {
      files: {
        "src/data/confirmed_global.csv": confirmedContent,
        "src/data/deaths_global.csv": deathsContent
      },
      commit: commitAndTitleMessage
    }
  });
};
