var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var strategy='local';

var sendJSONresponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.register = function(req, res) { 
	if (!req.body.name || !req.body.email || !req.body.password) {
		sendJSONresponse(res, 400, {
			"message": "All fields required"
		});
		return;
	}
	var user = new User();

	user.name = req.body.name;
	user.email = req.body.email;
	user.setPassword(req.body.password);

	user.save(function(err) {
		var token;
		if (err) {
			sendJSONresponse(res, 404, err);
		} else {
			token = user.generateJwt();
			console.log(token);
			sendJSONresponse(res, 200, {
				"token": token
			});
		}
	});
};

module.exports.login = function(req, res) {
	if (!req.body.email || !req.body.password) {
		sendJSONresponse(res, 400, {
			"message": "All fields required"
		});
		return;
	}
	passport.authenticate(strategy, function(err, user, info) {
		var token;
		if (err) {
			sendJSONresponse(res, 404, err);
			return;
		}
		if (user) {
			token = user.generateJwt();
			console.log(token);
			sendJSONresponse(res, 200, {
				"token": token
			});
		} else {
			sendJSONresponse(res, 401, info);
		}
	})(req, res);
};

module.exports.userexists = function(req, res) { 
		var email = req.query.email;
		console.log(email);
		User.findOne({
			email: email
		}).exec(function(err, user) { 
			if (!user) {
				sendJSONresponse(res, 200, { 
					"found": "false"
				});
				return;
			} else if (err) {
				console.log(err);
				sendJSONresponse(res, 404, err);
				return;
			}
			 sendJSONresponse(res,200,{"found":"true"});



		 });};