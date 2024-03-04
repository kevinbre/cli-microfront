import simpleGit, {SimpleGit} from "simple-git";
import {PROJECTS} from "../configs";
import {spinner} from "@clack/prompts";
import * as fs from "fs/promises";
import path from "path";

interface CloneRepositoryProps {
  /**
   * The name of the repository to be cloned.
   */
  repo_name: string;

  /**
   * The destination directory where the repository will be cloned.
   */
  destination: string;

  /**
   * The new name for the cloned repository.
   */
  new_repo_name: string;
}

/**
 * Clones a GitHub repository and updates the package.json file with a new repository name.
 *
 * @param {CloneRepositoryProps} props - The properties containing the repository name, destination directory, and new repository name.
 * @returns {Promise<void>} A Promise that resolves when the repository is successfully cloned and the package.json file is updated.
 * @throws {Error} Throws an error if the specified repository name is not found in the predefined projects.
 */
export async function cloneRepository({
  repo_name,
  destination,
  new_repo_name,
}: CloneRepositoryProps): Promise<void> {
  const findUrl = PROJECTS.find((project) => project.value === repo_name);

  if (!findUrl) {
    throw new Error(`Repository "${repo_name}" not found in the predefined projects.`);
  }

  const git: SimpleGit = simpleGit();
  const s = spinner();

  s.start("Cloning repository");

  try {
    await git.clone(findUrl.url!, destination);

    const packageJsonPath = path.join(destination, "package.json");
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
    packageJson.name = new_repo_name;
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf8");

    await fs.rm(path.join(destination, ".git"), {recursive: true, force: true});

    s.stop("Repository cloned successfully.");
  } catch (error) {
    s.stop("Error cloning repository.");
    throw error;
  }
}
