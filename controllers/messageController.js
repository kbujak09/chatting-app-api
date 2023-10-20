const asyncHandler = require('express-async-handler');
const Message = require('../models/message');
const User = require('../models/user');

exports.message_create = asyncHandler(async (req, res, next) => {
  const message = new Message({
    from: req.user._id,
    to: req.body.userId,
    text: req.body.text,
    date: new Date()
  });

  try {
    await message.validate();
    const result = await message.save();
    res.json(result);
  }
  catch(err) {
    console.error('Validation error:', err);
    res.status(400).json({
      success: false,
      message: 'Invalid message. Please check your input'
    });
  }
});

exports.message_delete = asyncHandler(async (req, res, next) => {
  const message = Message.findById(req.body.messageId).exec();
  
})