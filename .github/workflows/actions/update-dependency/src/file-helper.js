const core = require("@actions/core");

class FileHelper {
  #repositoryHelper;

  constructor(repositoryHelper) {
    this.#repositoryHelper = repositoryHelper;
  }

  async updateOpenApiToolsFile(branchName, directory, tags) {
    let file;
    try {
      file = await this.#repositoryHelper.getFileContent(
        branchName,
        `${directory}/openapitools.json`
      );
    } catch (error) {
      core.info("No OpenAPI file to update");
      return [];
    }

    try {
      let parsedContent = JSON.parse(file);
      let fileUpdated = false;

      const generators = parsedContent["generator-cli"].generators;
      for (const [generatorName, generator] of Object.entries(generators)) {
        const inputSpecUrl = generator.inputSpec;

        const urlParts = inputSpecUrl.split("/");
        const currentCommitId = urlParts[5];

        if (tags && tags.commitId) {
          const newCommitId = tags.commitId;

          if (currentCommitId !== newCommitId) {
            // Replace the commit ID in the URL
            generator.inputSpec = inputSpecUrl.replace(
              currentCommitId,
              newCommitId
            );
            fileUpdated = true;
            core.info(
              `${directory} - Updated ${generatorName} from ${currentCommitId} to new commit: ${newCommitId}`
            );
          }
        }
      }

      if (fileUpdated) {
        core.info(`OpenAPI tools file updated successfully`);
        return [
          {
            path: `${directory}/openapitools.json`,
            content: JSON.stringify(parsedContent, null, 2),
          },
        ];
      }

      core.info(`OpenAPI tools file already up to date`);
      return [];
    } catch (error) {
      throw new Error(`Error processing OpenAPI tools file: ${error.message}`);
    }
  }
}

module.exports = {
  FileHelper,
};
