var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var  applicant_details= new mongoose.Schema({
dob: 	 	{ type: Date,  default: Date.now},
work_exp: 	{ type: Number },
resume:   	{ type: String},
about:      { type: String},
photo:      { type: String},
applied:    { type:[mongoose.Schema.Types.ObjectId]},
favourite:  { type:[mongoose.Schema.Types.ObjectId]},
position:   { type:String},
company: 	{ type:String},
salary: 	{ type: Number}

});

var userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	hash: String,
	salt: String,
	applicant: Boolean,
	applicant_detail: {type: applicant_details, default: null}
});

userSchema.methods.setPassword = function(password){ console.log("hello");
this.salt = crypto.randomBytes(16).toString('hex');
this.hash = crypto.pbkdf2Sync(password, this.salt, 1000,64,'sha512').toString('hex');

};

userSchema.methods.validPassword = function(password,applicant) {
var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
return (this.hash === hash)&&(this.applicant===applicant);
};

userSchema.methods.generateJwt = function() {
var expiry = new Date();
expiry.setDate(expiry.getDate() + 7);
return jwt.sign({
_id: this._id,
email: this.email,
name: this.name,
exp: parseInt(expiry.getTime() / 1000),
}, process.env.JWT_SECRET );
};

module.exports=mongoose.model('User',userSchema);