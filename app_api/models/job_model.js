var mongoose= require('mongoose');


////////////////////////Question and Answers Posted Job Questions

var answer= new mongoose.Schema({
answerdate:  	{ type: Date,  default: Date.now},
answer: 		{type: String},
reply:          {type:[String]},
answerby:{type:String}
});

var q_a= new mongoose.Schema({
questiondate:  	{ type: Date,  default: Date.now},
question: {type: String},
answer: {type:[answer]},
askedby: {type:String}
});
///////////////////////////////////////////////////



var jobschema=new mongoose.Schema({
companyname: 	{ type: String, required: true},
company_id:     {type: mongoose.Schema.Types.ObjectId},
postname: 		{ type: String, required: true},
jd: 			{ type: String},
job_qual: 		{ type: String},
ctc: 			{ type: Number},
easy_apply: 	{ type: Boolean},
place:  		{ type: String, required: true},
workinghrs: 	{ type: String},
apply_link: 	{ type: String},
selection_process: 		{ type: String},
pitch: 			{ type: String},
job_type: 		{ type: String},
post_date:      { type: Date,  default: Date.now},
exp_date:      { type: Date,  default: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}, //One day validity
applicant: {type: [mongoose.Schema.Types.ObjectId]},
coords: 		{ type: [Number], required:true, index:'2dsphere'},
q_a: [q_a]
});




module.exports=mongoose.model('Job',jobschema);
				
						
