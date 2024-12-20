#!/usr/bin/env node

import fs from "fs";
import {
  menuActions,
  formatTimeStamp,
  fetchData,
  loader,
  sleep,
} from "./utils/index.js";
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import chalk from "chalk";

const myTasks = "myTasks.json";

// Checks if there are a JSON file existing, otherwise create a new one.
const checkFile = () => {
  if (fs.existsSync(myTasks)) {
    const dataBuffer = fs.readFileSync(myTasks);
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } else {
    return [];
  }
};

//List all tasks
const allTasks = async () => {
  await loader("Fetching all tasks...");
  const tasks = checkFile();

  if (tasks.length === 0) {
    console.log(chalk.red("No available tasks rn."));
  } else {
    console.log(chalk.cyan("Here are available tasks rn:"));
    fetchData(tasks);
  }
};

//Save tasks
const saveTask = (tasks) => {
  const dataJSON = JSON.stringify(tasks);
  fs.writeFileSync(myTasks, dataJSON);
};

//Add task
const addTask = async () => {
  const ans = await inquirer.prompt({
    name: "newTask",
    type: "input",
    message: "Please input your new task:",
  });

  await loader("Adding new task...");

  const tasks = checkFile();
  tasks.push({
    id: tasks.length + 1,
    description: ans.newTask,
    status: "pending",
    createdAt: formatTimeStamp(Date.now()),
    updatedAt: "",
  });
  saveTask(tasks);
  console.log(chalk.green(`New task has been added successfully!`));
};

//Update task description
const updateTask = async () => {
  const tasks = checkFile();

  if (tasks.length === 0) {
    await loader("Updating...");
    console.log(chalk.red("There is no task to update"));
    return;
  }

  const initialAns = await inquirer.prompt({
    name: "taskId",
    type: "input",
    message: "Please indicate the ID of the task:",
  });

  const taskExists = tasks.find(
    (task) => task.id === parseInt(initialAns.taskId)
  );

  if (!taskExists) {
    console.log(chalk.red("Something went wrong..."));
    return;
  }

  const ans = await inquirer.prompt({
    name: "updateTask",
    type: "input",
    message: "Input new task:",
  });

  await loader("Updating...");

  taskExists.description = ans.updateTask;
  taskExists.updatedAt = formatTimeStamp(Date.now());
  saveTask(tasks);
  console.log(
    chalk.green(`Updating task with id of ${taskExists.id} completed. \n`)
  );
};

//Toggle/mark the status of task
const updateStatus = async () => {
  const tasks = checkFile();

  if (tasks.length === 0) {
    await loader("Marking...");
    console.log(chalk.red("There is no task to mark"));
    return;
  }

  const initialAns = await inquirer.prompt({
    name: "taskId",
    type: "input",
    message: "Please indicate the ID of the task:",
  });

  const taskExists = tasks.find(
    (task) => task.id === parseInt(initialAns.taskId)
  );

  if (!taskExists) {
    console.log(chalk.red("Something went wrong..."));
    return;
  }

  const ans = await inquirer.prompt({
    name: "updateStatus",
    type: "list",
    message: "Select task status:",
    choices: ["pending", "done"],
  });

  await loader("Marking...");

  taskExists.status = ans.updateStatus;
  taskExists.updatedAt = formatTimeStamp(Date.now());
  saveTask(tasks);
  console.log(
    chalk.green(
      `Marking task id of ${taskExists.id} as ${ans.updateStatus} completed. \n`
    )
  );
};

//Delete task
const deleteTask = async () => {
  let tasks = checkFile();

  if (tasks.length === 0) {
    await loader("Deleting...");
    console.log(chalk.red("There is no task to delete"));
    return;
  }

  const ans = await inquirer.prompt({
    name: "deleteTaskId",
    type: "input",
    message: "Please specify the id of task you wish to delete:",
  });

  await loader("Deleting...");

  tasks = tasks.filter((task) => task.id !== parseInt(ans.deleteTaskId));
  saveTask(tasks);
  console.log(chalk.green(`You've successfully delete task`));
};

//List all tasks that are done
const tasksDone = async () => {
  await loader("Fetching Done Tasks...");
  const tasks = checkFile();
  const tasksDone = [];

  tasks.forEach((task) => task.status === "done" && tasksDone.push(task));

  if (tasksDone.length === 0) {
    console.log(chalk.red("Currently, there are no done tasks yet."));
  }

  console.log(chalk.cyan("Here are tasks that already done:"));
  fetchData(tasksDone);
};

//List all tasks that are done
const tasksPending = async () => {
  await loader("Fetching Done Tasks...");
  const tasks = checkFile();
  const pendingTask = [];

  tasks.forEach((task) => task.status === "pending" && pendingTask.push(task));

  if (pendingTask.length === 0) {
    console.log(chalk.red("There are no pending tasks."));
    return;
  }
  console.log(chalk.cyan("Here are still pending tasks:"));
  fetchData(pendingTask);
};

//Menu
const welcome = async () => {
  const title = chalkAnimation.neon("Welcome to Task Tracker App using CLI \n");

  await sleep();

  title.stop();

  const ans = await inquirer.prompt({
    name: "action",
    type: "list",
    message: "What would you want to do?",
    choices: [
      "List all tasks",
      "List all done tasks",
      "List all pending tasks",
      "Mark task",
      "Add task",
      "Update task",
      "Delete task",
      "Exit",
    ],
  });

  switch (ans.action) {
    case menuActions.Add:
      await addTask();
      break;

    case menuActions.ListAllTask:
      await allTasks();
      break;

    case menuActions.Update:
      await updateTask();
      break;

    case menuActions.Mark:
      await updateStatus();
      break;

    case menuActions.Delete:
      await deleteTask();
      break;

    case menuActions.ListAllDone:
      await tasksDone();
      break;

    case menuActions.ListPending:
      await tasksPending();
      break;

    default:
      return;
  }

  await welcome();
};

await welcome();
