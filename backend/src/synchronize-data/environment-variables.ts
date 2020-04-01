export const getGitHubAccessToken = (): string => {
  return process.env.GITHUB_ACCESS_TOKEN!;
};
