const core = require("@actions/core");

const { RepositoryHelper } = require("./repository-helper");
const { FileHelper } = require("./file-helper");

const BRANCH_NAME_ROOT = "update-dependencies";

const DIRECTORY_TO_UPLOAD = [
  "packages/pn-pa-webapp",
  "packages/pn-personafisica-webapp",
  "packages/pn-personagiuridica-webapp",
];

async function run() {
  const repositoryHelper = new RepositoryHelper();
  const fileHelper = new FileHelper(repositoryHelper);

  try {
    const updatedFiles = [];
    const bffVersion = await repositoryHelper.getLastTag("pn-bff");
    const pnFrontendVersion = await repositoryHelper.getLernaVersion();
    const branchName = `${BRANCH_NAME_ROOT}-${pnFrontendVersion}`;
    await repositoryHelper.createBranch(branchName);

    for (const directory of DIRECTORY_TO_UPLOAD) {
      const result = await fileHelper.updateOpenApiToolsFile(
        branchName,
        directory,
        bffVersion
      );
      updatedFiles.push(...result);
    }

    await repositoryHelper.commitChanges(branchName, updatedFiles);
    await repositoryHelper.createPullRequest(branchName, updatedFiles);
    return;
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
