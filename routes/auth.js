const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/register", async (req, res) => {
  const salt = bcrypt.genSaltSync(9);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);

  const user = await new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const response = await user.save();
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("user doesn't exist");

    const validPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!validPassword) return res.status(400).json("wrong password");

    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
