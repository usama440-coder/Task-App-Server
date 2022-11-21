const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const registerUserValidator = require("../utils/utils");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

// Desc     =>  Add a new user
// Access   =>  Public
// Method   =>  POST
// Route    =>  api/v1/user/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // check if user exists
  const isExist = await User.findOne({ email });
  if (isExist) {
    res.status(409);
    throw new Error("User already exists");
  }

  //   if all the fields are given
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  //   validator
  if (registerUserValidator(name, email, password)) {
    res.status(400);
    throw new Error("Please enter correct fields");
  }

  //   hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({ success: true, user });
});

// Desc     =>  Login a user
// Access   =>  Public
// Method   =>  POST
// Route    =>  api/v1/user/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // email and password are given
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  const user = await User.findOne({ email });

  // user exists and compare password
  if (user && (await bcrypt.compare(password, user.password))) {
    // generate token
    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({ success: true, user, token });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

// Desc     =>  Update a user
// Access   =>  Private (User only)
// Method   =>  PUT
// Route    =>  api/v1/user/:id
const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400);
    throw new Error("User not found");
  }

  // check if requested user id matches with logged in user
  // it should not access other's data
  if (id !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  await User.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(201).json({ success: true, message: `User updated successfully` });
});

// Desc     =>  Get a user
// Access   =>  Private (Admin only)
// Method   =>  GET
// Route    =>  api/v1/user/:id
const getUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400);
    throw new Error("User not found");
  }

  const user = await User.findById(id);

  // check if requested user id matches with logged in user
  // it should not access other's data
  if (id !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ success: true, user });
});

// Desc     =>  Get all users
// Access   =>  Private (Admin only)
// Method   =>  GET
// Route    =>  api/v1/user
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ success: true, users });
});

// Desc     =>  Delete a user
// Access   =>  Private (Admin only)
// Method   =>  DELETE
// Route    =>  api/v1/user/:id
const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400);
    throw new Error("User not found");
  }

  let user = await User.find({ id });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user = await User.findByIdAndDelete(id);
  res.status(202).json({
    success: true,
    message: `User deleted successfully with an email ${user.email}`,
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  deleteUser,
  updateUser,
};
