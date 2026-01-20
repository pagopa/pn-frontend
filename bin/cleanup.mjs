import fs from "fs/promises";
import path from "path";

const rootPath = process.cwd(); // Get the path of the project's root directory

const checkIfNodeModulesExists = async (directory) => {
  try {
    await fs.access(directory);
    return true;
  } catch (error) {
    return false;
  }
};

const cleanup = async () => {
  try {
    const rootNodeModulesPath = path.join(rootPath, "node_modules");
    // Check if node_modules exist in the project's root and removes it
    if (await checkIfNodeModulesExists(rootNodeModulesPath)) {
      console.log(`Removing node_modules in:`, rootNodeModulesPath);
      try {
        await fs.rm(rootNodeModulesPath, { recursive: true });
      } catch (error) {
        console.error(
          "Error while removing node_modules in: " + rootNodeModulesPath,
          error
        );
      }
    } else {
      console.log("No node_modules in: " + rootNodeModulesPath);
    }

    const packages = await fs.readdir(rootPath + "/packages");
    for (const node_modules of packages) {
      const packageNodeModulesPath = path.join(
        rootPath,
        "packages",
        node_modules,
        "node_modules"
      );
      // Check if node_modules exist in the package and removes it
      if (await checkIfNodeModulesExists(packageNodeModulesPath)) {
        console.log(`Removing node_modules in:`, packageNodeModulesPath);
        try {
          await fs.rm(packageNodeModulesPath, { recursive: true });
        } catch (error) {
          console.error(
            "Error while removing node_modules in: " + packageNodeModulesPath,
            error
          );
        }
      } else {
        console.log("No node_modules in: " + packageNodeModulesPath);
      }
    }
    console.log("All node_modules directories removed successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
};

cleanup();
