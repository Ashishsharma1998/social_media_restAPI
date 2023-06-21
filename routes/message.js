const Message = require("../models/message");
const router = require("express").Router();

router.post("/", async (req, res) => {
  const message = new Message(req.body);
  try {
    const savedMessage = await message.save();
    return res.status(200).json(savedMessage);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/:conversationId", async (req, res) => {
  try {
    const message = await Message.find({
      conversationId: req.params.conversationId,
    });
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
