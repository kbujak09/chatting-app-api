const asyncHandler = require('express-async-handler');
const Message = require('../models/message');
const User = require('../models/user');
const Conversation = require('../models/conversation');
const mongoose = require('mongoose');

exports.message_create = asyncHandler(async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.body.from, req.body.to] },
    }).exec();

    if (!conversation) {
      const newConversation = new Conversation({
        members: [req.body.from, req.body.to],
        messages: [],
      });

      await newConversation.save();
    }

    const message = new Message({
      from: req.body.from,
      to: req.body.to,
      text: req.body.text,
    });

    await message.validate();
    const result = await message.save();

    await Conversation.findOneAndUpdate(
      { members: { $all: [req.body.from, req.body.to] } },
      { $push: { messages: message } }
    );

    res.json(result);
  } catch (err) {
    console.error('Error creating message:', err);
    res.status(400).json({
      success: false,
      message: 'Invalid message. Please check your input',
    });
  }
});

exports.message_delete = asyncHandler(async (req, res, next) => {
  const message = Message.findById(req.body.messageId).exec();
  
})