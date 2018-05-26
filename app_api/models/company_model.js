var mongoose= require('mongoose');


////////////////////////Question and Answers

var answer= new mongoose.Schema({
answerdate:  	{ type: Date,  default: Date.now},
answerBy: {type: String},
answer: {type: String},
flag: {type: Boolean, default: false},
upvote: {type: Number, default: 0},
downvote: {type: Number, default: 0}
});

var q_a= new mongoose.Schema({
questiondate:  	{ type: Date,  default: Date.now},
question: {type: String},
answer: [answer],
askedby: {type: String}
});

///////////////////////////////////////////////////

////////////////////////Salaries
var salaries= new mongoose.Schema({
location:  	{ type: String},
salary: {type: Number, default: 0},
desg: { type: String}
});
////////////////////////////////////////////////////

//////////////////////////////////////////////////Company Reviews
var reviewcomment= new mongoose.Schema({ 
commentdate:    { type: Date,  default: Date.now},
comment :       { type: String, required: true},
author:         { type: String},
});

var companyreview= new mongoose.Schema({
reviewtitle: 	{ type: String, required: true},
rating: 		{ type: Number, "default":0, min:0,max:5},
reviewdate:     { type: Date,  default: Date.now},
review:         { type: String, required: true},
author:         { type: String},
commentnos:     { type:Number, "default":0},
upvotes:        { type:Number, "default":0},
comments: 		 [reviewcomment] 

});
//////////////////////////////////////////////////////////
var companyschema=new mongoose.Schema({
companyname: 	{ type: String, required: true},
tagline: 		{ type: String},
avgrating: 		{ type: Number, "default":0, min:0,max:5},
about: 		    { type: String},
logo: 			{ type: String},
photos: 		{ type: [String]},
address:  		{ type: String, required: true},
workinghrs: 	{ type: [String],"default": 'NA'},
email: 			{ type: String},
website: 		{ type: String},
telephone: 		{ type: String},
coords: 		{ type: [Number], index:'2dsphere'},
jobs: {type: [ mongoose.Schema.Types.ObjectId]},
reviews: [companyreview],
salaries: [salaries],
q_a: [q_a],
});

module.exports=mongoose.model('Company',companyschema);
				
						
