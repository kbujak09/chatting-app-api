const asyncHandler = require('express-async-handler');
const Conversation = require('../models/conversation');
const User = require('../models/user');
const Message = require('../models/message');

exports.conversation_list = asyncHandler(async (req, res, next) => {
  try {
    if (!req.query.userId) {
      return res.status(400).json({ error: "userId not specified" });
    }

    const list = await Conversation.find({
      members: req.query.userId,
      messages: { $exists: true, $not: { $size: 0 } }
    })
      .populate('members', 'username')
      .exec();

    for (const conversation of list) {
      const lastMessage = await Message.findOne({
        $and: [
          { from: { $in: conversation.members } },
          { to: { $in: conversation.members } }
        ]
      }).sort({ createdAt: -1 }).limit(1);

      conversation.messages = lastMessage ? [lastMessage] : [];
    }

    res.json(list);
  } catch (err) {
    console.error('Error while fetching conversations:', err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.conversation_create = asyncHandler(async (req, res, next) => {
  const from = await User.findById(req.body.fromId);
  const to = await User.findOne({
    username: { $regex: new RegExp(`^${req.body.toId}$`, 'i') }
  });

  if (!to) {
    return res.status(400).json({ error: 'User not found.' });
  }

  const members = [from._id, to._id];
  
  try {
    const existingConversation = await Conversation.findOne({
      members: { $all: members },
    });

    if (existingConversation) {
      return res.status(201).json({ conversation: existingConversation })
    }
    
    const conversation = await new Conversation({members});
    const savedConversation = await conversation.save();

    res.status(201).json({ conversation });
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

exports.conversation_get = asyncHandler(async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId)
      .populate('members')
      .populate('messages')
      .exec();

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    const lastMessage = await Message.findOne({
      $or: [
        { from: { $in: conversation.members } },
        { to: { $in: conversation.members } }
      ]
    }).sort({ createdAt: -1 }).limit(1);

    conversation.messages = conversation.messages.reverse();

    conversation.lastMessage = lastMessage;

    console.log(lastMessage)

    res.status(200).json({ conversation });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});