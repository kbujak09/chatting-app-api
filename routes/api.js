const express = require('express');
const passport = require('passport');
const router = express.Router();

const authController = require('../controllers/authController');
const conversationController = require('../controllers/conversationController');
const messageController = require('../controllers/messageController');

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.get('/conversations', passport.authenticate('jwt', {session: false}),conversationController.conversation_list);

router.post('/conversations', passport.authenticate('jwt', {session: false}),conversationController.conversation_create);

router.get('/conversations/:conversationId', passport.authenticate('jwt', {session: false}),conversationController.conversation_get);

router.post('/messages', passport.authenticate('jwt', {session: false}),messageController.message_create);

module.exports = router;
