const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  members: [{ type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
});

module.exports = mongoose.model('Conversation', ConversationSchema);