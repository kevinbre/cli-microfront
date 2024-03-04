import * as clack from "@clack/prompts";
import {intro, outro} from "@clack/prompts";

import * as fs from "fs";

import path from "path";
import color from "picocolors";
import {PROJECTS} from "./configs";
import {cloneRepository} from "./utils/cloneRepository";
import {createContainerSettings} from "./utils/createContainerSettings";
import {setUtilities} from "./utils/setUtilities";

function onCancel() {
  clack.cancel("Operation cancelled.");
  process.exit(0);
}

async function main() {
  intro(`${color.bgMagenta(color.italic(" create-micro-front "))}`);

  let destination = "";

  const project = await clack.group(
    {
      name: () =>
        clack.text({
          message: "What is the name of your project?",
          placeholder: "microfrontend-example",
          validate: (value) => {
            destination = path.join(process.cwd(), value);

            if (value.match(/[^a-zA-Z0-9-_]+/g)) {
              return "Project name can only contain letters, numbers, dashes, and underscores";
            }

            if (fs.existsSync(destination)) {
              return "The project already exist";
            }
          },
        }),

      project_selected: ({results}) =>
        clack.select({
          message: `Pick a project type within "${results.name}"`,
          options: PROJECTS.map((project) => ({
            value: project.value,
            label: project.title,
            url: project.url,
          })),
        }),
    },
    {
      onCancel: () => {
        onCancel();
      },
    },
  );

  await cloneRepository({
    repo_name: project.project_selected as string,
    destination,
    new_repo_name: project.name,
  });

  await setUtilities({project: project.project_selected as string, destination});

  const containerQuestion = await clack.confirm({
    message: "Do you want to create config for container?",
  });

  if (containerQuestion) {
    const configContainer = await clack.group(
      {
        title: () =>
          clack.text({
            message: "Title",
            placeholder: "example-app",
          }),
        scope: () =>
          clack.text({
            message: "Scope",
            placeholder: "EXAMPLE-APP",
          }),
        url: () =>
          clack.text({
            message: "url",
            placeholder: "http://localhost:3000/",
          }),
        endpoint: () =>
          clack.text({
            message: "Endpoint",
            placeholder: "example-app",
          }),
      },
      {
        onCancel: () => {
          onCancel();
        },
      },
    );

    await createContainerSettings({container_config: configContainer, destination});
  }

  let nextSteps = `${color.magenta("cd " + project.name)}\n${color.magenta("npm install")}\n${color.magenta("npm run dev")}`;

  clack.note(nextSteps, "Next steps 🪄");

  if (containerQuestion)
    clack.note(
      `Check in the root of the project for ${color.cyan("container.json")} to obtain \ncontainer configuration.`,
    );

  outro(`⚡ The project has been created ⚡`);
}

main().catch(console.error);
