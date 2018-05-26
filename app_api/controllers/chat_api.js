var mongoose=require('mongoose');

require('../models/chat');
var Chat = mongoose.model('Chat');


module.exports.getChat=function(req, res) { 
	Chat.find({ room: req.params.room })
	.exec((err, chats)=> { 
    if (err) return {error: "API Error"};
    res.json(chats);
  });

};

module.exports.saveChat=function(req, res) {

	Chat.create((req.body),(err, post)=> { 
    if (err) return {error: "API Error"};
   res.json(post);
  });



};
	


