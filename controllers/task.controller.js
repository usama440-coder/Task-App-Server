const Task = require("../models/Task.model");
const asyncHandler = require("express-async-handler");

// Desc     =>  Add a new task
// Access   =>  Private
// Method   =>  POST
// Route    =>  api/v1/task
const addTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;
  if (!title || !description || !status || !req.user.id) {
    res.status(400);
    throw new Error("Please provide all the required fields");
  }

  const task = await Task.create({
    title,
    description,
    status,
    user: req.user.id,
  });

  res.status(201).json({ success: true, task });
});

// Desc     =>  Get all tasks
// Access   =>  Private
// Method   =>  GET
// Route    =>  api/v1/task
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.status(200).json({ success: true, tasks });
});

// Desc     =>  Get a single task
// Access   =>  Private
// Method   =>  GET
// Route    =>  api/v1/task/:id
const getTask = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(404);
    throw new Error("Task not found");
  }

  const task = await Task.findOne({ _id: id, user: req.user.id });
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.status(200).json({ success: true, task });
});

// Desc     =>  Edit a task
// Access   =>  Private
// Method   =>  PUT
// Route    =>  api/v1/task/:id
const editTask = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(404);
    throw new Error("Task not found");
  }

  const task = await Task.findOne({ _id: id, user: req.user.id });
  if (!task) {
    res.status(404);
    throw Error("Task not found");
  }

  await Task.findByIdAndUpdate(id, req.body, { new: true });
  res.status(201).json({ success: true, message: "Task updated successfully" });
});

// Desc     =>  Delete a task
// Access   =>  Private
// Method   =>  DELETE
// Route    =>  api/v1/task/:id
const deleteTask = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(404);
    throw new Error("Task not found");
  }

  const task = await Task.findOne({ _id: id, user: req.user.id });
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  await Task.findByIdAndDelete(id);
  res.status(202).json({ success: true, message: "Task deleted successfully" });
});

module.exports = {
  addTask,
  getTasks,
  getTask,
  editTask,
  deleteTask,
};
