const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const userApiRoutes = require("./routes/users");
const authApiRoutes = require("./routes/auth");
const postApiRoutes = require("./routes/post");
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(morgan("common"));
app.use("/api/user", userApiRoutes);
app.use("/api/auth", authApiRoutes);
app.use("/api/posts", postApiRoutes);

app.listen(3001, async () => {
  console.log("server is runing at port 3001");
  await mongoose.connect(process.env.MONGODB_URL);
});
