const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 16, minLength: 3 },
  password: { type: String, required: true, minLength: 8 },
  online: { type: Boolean, default: false },
  date_created: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', UserSchema);