const express = require("express");
const userRouter = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  deleteUser,
  updateUser,
} = require("../controllers/user.controller");
const { protect, checkAdmin } = require("../middleware/auth.middleware");

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/", protect, checkAdmin, getUsers);
userRouter.get("/:id", protect, getUser);
userRouter.delete("/:id", protect, checkAdmin, deleteUser);
userRouter.put("/:id", protect, updateUser);

module.exports = userRouter;
