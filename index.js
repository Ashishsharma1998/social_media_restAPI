const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const userApiRoutes = require("./routes/users");
const authApiRoutes = require("./routes/auth");

const app = express();
dotenv.config();

app.use(express.json());
app.use(morgan("common"));
app.use("/api/user", userApiRoutes);
app.use("/api/auth", authApiRoutes);

app.listen(3000, async () => {
  console.log("server is runing at port 3000");
  await mongoose.connect(process.env.MONGODB_URL);
});
