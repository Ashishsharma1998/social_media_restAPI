const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const router = express.Router();

//update a user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = bcrypt.genSaltSync(10);
        req.body.password = bcrypt.hashSync(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      return res.status(200).json("account has been successfully updated!");
    } catch (error) {
      return res.status(403).json(error);
    }
  } else {
    res.status(500).json("you can only update your account!!!");
  }
});

//delete a user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("account has been successfully deleted!");
    } catch (error) {
      return res.status(403).json(error);
    }
  } else {
    res.status(500).json("you can only delete your account!!!");
  }
});

//get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, createdAt, updatedAt, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (error) {
    return res.status(404).json(error);
  }
});

//follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        return res.status(200).json("user has been successfully followed:)");
      } else {
        return res.status(403).json("you already follow this user!!!");
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("you can not follow yourself!!!");
  }
});

//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        return res.status(200).json("user has been successfully unfollowed:)");
      } else {
        return res.status(403).json("you don't follow this user!!!");
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("you can not unfollow yourself!!!");
  }
});

module.exports = router;
