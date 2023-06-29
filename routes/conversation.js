const router = require("express").Router();
const { response } = require("express");
const Conversation = require("../models/conversation");

//post a conversation
router.post("/", async (req, res) => {
  try {
    const newConversaton = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });
    const savedDocument = await newConversaton.save();
    return res.status(200).json(savedDocument);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//get conversation
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/:firstUser/:secondUser", async (req, res) => {
  try {
    const response = await Conversation.findOne({
      members: { $all: [req.params.firstUser, req.params.secondUser] },
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
