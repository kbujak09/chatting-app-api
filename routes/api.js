const express = require('express');
const passport = require('passport');
const router = express.Router();

const authController = require('../controllers/authController');
const conversationController = require('../controllers/conversationController');
const messageController = require('../controllers/messageController');

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.get('/conversations', conversationController.conversation_list);

router.post('/conversations', conversationController.conversation_create);

router.get('/conversations/:conversationId', conversationController.conversation_get);

router.post('/messages', messageController.message_create);

module.exports = router;
