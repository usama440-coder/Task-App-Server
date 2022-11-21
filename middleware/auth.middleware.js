const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User.model");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not Authorized");
  }
});

const checkAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.isAdmin === false) {
    res.status(401);
    throw new Error("Not Authorized (Admin Only)");
  }
  next();
});

module.exports = { protect, checkAdmin };
