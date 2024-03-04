import {spinner} from "@clack/prompts";
import {configFileContent} from "../configs/container-config";
import {ContainerConfig} from "../types/utilities";
import {writeFile} from "fs/promises";
import {setTimeout} from "timers/promises";

/**
 * Properties for creating container settings.
 */
interface Props {
  /**
   * The container configuration to be used for creating settings.
   */
  container_config: ContainerConfig;
  /**
   * The destination directory where the container settings will be created.
   */
  destination: string;
}

/**
 * Creates container settings using the provided configuration and writes them to a file.
 *
 * @param {Props} props - The properties containing the container configuration and destination directory.
 * @returns {Promise<void>} A Promise that resolves when the container settings are successfully created.
 */
export async function createContainerSettings({
  container_config,
  destination,
}: Props): Promise<void> {
  const s = spinner();
  s.start("Creating container settings");

  const newConfig = {
    ...configFileContent,
    title: container_config.title,
    scope: container_config.scope,
    url: container_config.url,
    endpoint: container_config.endpoint,
  };

  await writeFile(destination + "/container.json", JSON.stringify(newConfig, null, 2), "utf8");

  await setTimeout(1500);

  s.stop("Container settings created");
}
