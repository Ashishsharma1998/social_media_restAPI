const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const userApiRoutes = require("./routes/users");
const authApiRoutes = require("./routes/auth");
const postApiRoutes = require("./routes/post");
const app = express();
dotenv.config();

app.use(cors());

app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    res.status(200).json("file successfully uploaded!");
  } catch (error) {
    console.log(error);
  }
});

app.use("/api/user", userApiRoutes);
app.use("/api/auth", authApiRoutes);
app.use("/api/posts", postApiRoutes);

app.listen(3001, async () => {
  console.log("server is runing at port 3001");
  await mongoose.connect(process.env.MONGODB_URL);
});
