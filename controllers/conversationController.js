const asyncHandler = require('express-async-handler');
const Conversation = require('../models/conversation');
const User = require('../models/user');

exports.conversation_list = asyncHandler(async (req, res, next) => {
  try {
    if (!req.query.userId) {
      return res.status(400).json({ error: "userId not specified" });
    }

    const list = await Conversation.find({
      members: req.query.userId,
    })
      .populate('members', 'username')
      .populate({
        path: 'messages',
        options: { sort: { createdAt: -1 }, limit: 1 },
        populate: {
          path: 'from',
          model: 'User', // Replace 'User' with your actual User model
          select: 'username',
        },
      })
      .exec();

    res.json(list);
  } catch (err) {
    console.error('Error while fetching conversations:', err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.conversation_create = asyncHandler(async (req, res, next) => {
  const { members } = req.body;
  
  try {
    const existingConversation = await Conversation.findOne({
      members: { $all: members },
    });

    if (existingConversation) {
      return res.status(400).json({ error: 'Conversation already exists.'})
    }

    const conversation = await new Conversation({members});
    const savedConversation = await conversation.save();

    res.status(201).json({ conversation });
  }
  catch (err) {
    res.status(500).json ({ error: err.message });
  }
});