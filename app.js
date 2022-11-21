const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./db/db");
const cors = require("cors");
const userRouter = require("./routes/user.route");
const taskRouter = require("./routes/task.route");
const errorHandler = require("./middleware/error.middleware");

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter);

// error
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is litening on port ${PORT}`);
});
