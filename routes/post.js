const express = require("express");
const Post = require("../models/post");
const User = require("../models/user");
const router = express.Router();

//create a post
router.post("/", async (req, res) => {
  const post = new Post(req.body);
  try {
    const savepost = await post.save();
    return res.status(200).json(savepost);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await Post.updateOne({ $set: req.body });
      return res.status(200).json("your post has been updated successfully:)");
    } else {
      return res.status(403).json("you can only update your post!!!");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await Post.deleteOne();
      return res.status(200).json("your post has been deleted successfully:)");
    } else {
      return res.status(403).json("you can only delete your post!!!");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

//like/dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      return res.status(200).json("post has been liked successfully:)");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      return res.status(200).json("post has been disliked successfully:)");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//get timeline posts
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPost = await Post.find({ userId: currentUser._id });
    const frientPost = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    return res.status(200).json(userPost.concat(...frientPost));
  } catch (error) {
    return res.status(500).json(error);
  }
});

//get all users posts
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
