


var express = require('express');
var Chatrouter = express.Router();
var chatCtrl = require('../controllers/chat_api');


////////////////////////////////////////////////////////////////////////////////
Chatrouter.get('/:room',chatCtrl.getChat);
Chatrouter.post('/post',chatCtrl.saveChat);


module.exports = Chatrouter;


