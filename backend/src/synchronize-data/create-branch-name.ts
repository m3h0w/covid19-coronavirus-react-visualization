export const createBranchName = (
  getFormattedDate: () => string
) => (): string => {
  return `${getFormattedDate()}-data-update`;
};
