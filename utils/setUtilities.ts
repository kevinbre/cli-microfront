import * as p from "@clack/prompts";
import {readFile, writeFile} from "fs/promises";
import path from "path";
import {setTimeout} from "timers/promises";
import {UTILITIES} from "../configs";
import {Utility} from "../types/utilities";

interface Props {
  project: string;
  destination: string;
}

/**
 * Sets utilities for a project by adding dependencies to the package.json file.
 *
 * @param {Props} props - The properties containing the project name and destination directory.
 * @returns {Promise<void>} A Promise that resolves when the dependencies are successfully added.
 */
export async function setUtilities({project, destination}: Props): Promise<void> {
  /**
   * Callback function executed when the user cancels the operation.
   *
   * @returns {void}
   */
  async function onCancel() {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const selectedUtilities = p.group(
    {
      selected: () =>
        p.multiselect({
          message: "Select utilities:",
          options: UTILITIES[project].map((utilGroup) => ({
            label: utilGroup.title,
            value: utilGroup.utilities,
          })),
          required: false,
        }) as any as Promise<Array<Utility>>,
    },
    {
      onCancel: onCancel,
    },
  );

  const utilities = await selectedUtilities;

  if (Array.isArray(utilities.selected) && utilities.selected.length > 0) {
    const s = p.spinner();
    s.start("Adding dependencies");

    const packageJsonPath = path.join(destination, "package.json");
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));

    utilities.selected.forEach((selectedUtility) => {
      const dependenciesSection = selectedUtility.dev
        ? packageJson.devDependencies
        : packageJson.dependencies;
      dependenciesSection[selectedUtility.dependencie] = selectedUtility.version || "latest";
    });

    await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf8");

    await setTimeout(1500);

    s.stop("Dependencies added!");
  }
}
