import chalk from "chalk";
import { createSpinner } from "nanospinner";

export const formatTimeStamp = (timestamp) => {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${month}/${day}/${year} - ${hours}h:${minutes}m:${seconds}s`;
};

export const menuActions = {
  ListAllTask: "List all tasks",
  ListAllDone: "List all done tasks",
  ListAllNotDone: "List all not done tasks",
  ListPending: "List all pending tasks",
  Mark: "Mark task",
  Add: "Add task",
  Update: "Update task",
  Delete: "Delete task",
};

export const fetchData = (tasks) => {
  return tasks.map((task) => {
    const taskDescription =
      task.status === "done"
        ? chalk.strikethrough(task.description)
        : task.description;
    const taskStatus =
      task.status === "done"
        ? chalk.green(task.status)
        : chalk.yellow(task.status);
    console.log(`
${chalk.bold("id")}: ${task.id} 
${chalk.bold("task")}: ${taskDescription} 
${chalk.bold("status")}: ${taskStatus}
${chalk.bold("createdAt")}: ${task.createdAt}
${chalk.bold("updatedAt")}: ${task.updatedAt} \n`);
  });
};

export const sleep = () => new Promise((r) => setTimeout(r, 2000));

export const loader = async (mess) => {
  const spinner = createSpinner(mess).start();
  await sleep();

  if (mess) {
    spinner.success();
  } else {
    spinner.error({ text: "The message parameter is required." });
    process.exit(1);
  }
};
