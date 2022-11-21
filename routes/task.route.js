const express = require("express");
const taskRouter = express.Router();
const {
  addTask,
  getTasks,
  getTask,
  editTask,
  deleteTask,
} = require("../controllers/task.controller");
const { protect } = require("../middleware/auth.middleware");

taskRouter.post("/", protect, addTask);
taskRouter.get("/", protect, getTasks);
taskRouter.get("/:id", protect, getTask);
taskRouter.put("/:id", protect, editTask);
taskRouter.delete("/:id", protect, deleteTask);

module.exports = taskRouter;
