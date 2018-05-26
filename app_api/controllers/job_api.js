var mongoose=require('mongoose');

var Job = mongoose.model('Job');
/////////////////////////////////////////////////////////////////////////////////////////////////////
//All Job + NearBy  GET : return types:  DATA ERR [] 
//REST METHODS  return types:  DATA ERR MESSAGES
/////////////////////////////////////////////////////////////////////////////////////////////////////

//Authorization function

var getAuthor = function(req, res, callback) {
	if (req.payload && req.payload.email) { 
		User
			.findOne({
				email: req.payload.email
			})
			.exec(function(err, user) {
				if (!user) {
					sendJSONresponse(res, 404, {
						"message": "User not found"
					});
					return;
				} else if (err) {
					console.log(err);
					sendJSONresponse(res, 404, err);
					return;
				}
				callback(req, res, user.name);
			});
	} else {
		sendJSONresponse(res, 404, {
			"message": "User not found"
		});
		return;
	}
};

/////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Distance based Job selector

module.exports.JobNearBy=function(req, res) { //checked
	
	var lng=parseFloat(req.query.lng);
	var lat=parseFloat(req.query.lat);
	var maxDis=parseFloat(req.query.distance);
	

	Job.aggregate(
        [
            {
                '$geoNear': {
                    'near': { "type" : "Point", "coordinates" : [ lng, lat] },
                    'spherical': true,
                    'distanceField': 'distance',
                    'maxDistance': maxDis,
                    'limit':10
                }
            }
        ],
        function(err, results) {
    if(err){sendJsonResponse(res,404,err); return;}
	var jobs=[];
	results.forEach( function(doc) { 


	jobs.push(doc);


	Job.findById(doc._id).exec((err,job)=>{job.distance=doc.distance; 
																	job.save((err,job)=>{ 
																		if (err) { console.log("Error API: Saving distance in Job: ",err);
																		
																		sendJsonResponse(res, 400, err);} 
																	  });		
																					});

			});

	if (jobs[0])sendJsonResponse(res,200,jobs);
	else 	sendJsonResponse(res,200,[]);
        }
    );
};

////////////////////////////////////*Read*//////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////All JOBS
module.exports.AllJobs=function(req, res) {  //checked
	
Job.find({})
    .select('-applicant -q_a')
	.exec((err,jobs)=>{
	/*	if(!jobs)
			{sendJsonResponse(res,200,[]); return;} */// empty array allowed exception
	/*	else*/ if (err) 
			{ console.log("Error API: All Jobs: ",err);
			  sendJsonResponse(res,200,err); return;}
		else
			{sendJsonResponse(res,200,jobs);}
	});
/*   var err =new Error("Tou are stupid");
	sendJsonResponse(res,200,err); return;*/
};
///////////////////////////////////////////////////////////////////////////////////JOB BY ID
module.exports.SingleJob=function(req, res) { //checked
 if(req.params&&ValidID(req.params.jobid))
 {
	Job
	.findById(req.params.jobid)
	.select('-applicant -q_a')
	.exec((err,job)=>{
		if(!job)
			{sendJsonResponse(res,200,{"message":"API: Job Not Found"}); return;}
		else if (err) 
			{ console.log("Error API: Single Job : ",err);
				sendJsonResponse(res,200,err); return;}
		else
			{sendJsonResponse(res,200,job);}
	});}
 else {sendJsonResponse(res,404,{"message":"API: Invalid Address"});}


};
///////////////////////////////////////////////////////////////////////////////////QUESTIONS OF PARTICULAR JOB
module.exports.AllQuestions=function(req, res) {
 if(req.params&&ValidID(req.params.jobid))
	{Job.find({_id:req.params.jobid})
		.select('q_a')
		.exec((err,job)=>{ 
			if(!job[0])
				{sendJsonResponse(res,200,{"message":"API: Job Not Found"}); return;}
			var questions= job[0].q_a; console.log(job);
			if(!questions)
				{sendJsonResponse(res,200,{"message":"API: Questions Not Found"}); return;}
			else if (err) 
				{console.log("Error API: All Questions: ",err);
					sendJsonResponse(res,200,err); return;}
			else
				{ sendJsonResponse(res,200,questions);}
		});}
 else {sendJsonResponse(res,404,{"message":"API: Invalid Address"});}

 
};
///////////////////////////////////////////////////////////////////////////////////ANSWERS OF PARTICULAR QUESTION
module.exports.AllAnswers=function(req, res) {
 if(req.params&&ValidID(req.params.jobid,req.params.questionid))
	{Job.find({_id:req.params.jobid})
		.select('q_a')
		.exec((err,job)=>{
			if(!job[0])
				{sendJsonResponse(res,200,{"message":"API: Job Not Found"}); return;}
			var question=job[0].q_a.id(req.params.questionid);
			if(!question)
				{sendJsonResponse(res,200,{"message":"API: Question Not Found"}); return;}
			else if (err) 
				{console.log("Error API: All Answers: ",err);
					sendJsonResponse(res,200,err); return;}
			else
				{ sendJsonResponse(res,200,question);}
		});}
 else {sendJsonResponse(res,404,{"message":"API: Invalid Address"});}

 
};
///////////////////////////////////////////////////////////////////////////////////CHECK IF APPLICANT HAS APPLIED FOR THE JOB
module.exports.CheckApplicant=function(req, res) { //checked
 if(req.params&&ValidID(req.params.jobid,req.params.applicantid))
 {
 Job.find({_id:req.params.jobid})
	.select('applicant')
	.exec((err,job)=>{  // cases error, empty array, data

							if (err) {
								sendJsonResponse(res, 400, err); return; } 
							else if(!job[0])
				              {sendJsonResponse(res,200,{"message":"API: Job Not Found"}); return;}
							else {
									var index=job[0].applicant.indexOf(req.params.applicantid);
									if(index===-1)
										{sendJsonResponse(res,200,{"applied":"false"}); return;}
									else
										{sendJsonResponse(res,200,{"applied":"true"});}  } 
		                   });
 }
	else {sendJsonResponse(res,404,{"message":"API: Invalid Address"});}
};
///////////////////////////////////////////////////////////////////////////////////RETURNS ALL APPLICANTS
module.exports.AllApplicants=function(req, res) { //checked
 if(req.params&&ValidID(req.params.jobid))
	{
 Job.find({_id:req.params.jobid})
	.select('applicant')
	.exec((err,job)=>{ 
							if (err) {
								sendJsonResponse(res, 400, err); return; } 
							else if(!job[0])
				              {sendJsonResponse(res,200,{"message":"API: Job Not Found"}); return;}
							else {
									sendJsonResponse(res,200,job[0].applicant);  } 
		                   });
   }
 else {sendJsonResponse(res,404,{"message":"API: Invalid Address"});}

};


////////////////////////////////////*Write*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////POST JOB
module.exports.AddJob=function(req, res)  // checked works even if object not present on body
	
{	Job.create({
companyname: 	req.body.companyname,
company_id:    req.body.company_id,
postname: 		req.body.postname,
jd: 			req.body.jd,
job_qual: 		req.body.job_qual,
ctc: 			req.body.ctc,
easy_apply: 	req.body.easy_apply,
place:  		req.body.place,
workinghrs: 	req.body.workinghrs,
apply_link: 	req.body.apply_link,
selection_process: 		req.body.selection_process,
pitch: 			req.body.pitch,
job_type: 		req.body.job_type,
exp_date:  req.body.exp_date,   
coords: [parseFloat(req.body.lng),parseFloat(req.body.lat)]  
		
	 		},	
	(err,job)=>{ 

					if (err) {  console.log('Error API: Add Job: ',err);
						sendJsonResponse(res, 400, err); } 
					else { 	
						sendJsonResponse(res, 201, job); }
				    });

};
///////////////////////////////////////////////////////////////////////////////////ADD QUESTION TO POSTED JOB
module.exports.AddQuestion=function(req, res) { //checked
//getAuthor (req,res,function (req,res,username){
 if(req.params&&req.params.jobid&&req.body.question)
  { 
    Job.findById(req.params.jobid)
	.select('q_a')
	.exec(function (err,job){
						 
							 if(!job)
				              {sendJsonResponse(res,200,{"message":"API: Unable to ADD Question, Job Not Found"}); return;}
				             else if (err) {
							   sendJsonResponse(res, 400, err);
							   }
							else {

							job.q_a.push({ 	question: req.body.question,
										    answer: []});
							job.save((err,job)=>{
										if (err) { sendJsonResponse(res, 400, err); 
											console.log('Error API: Add Question: ',err);} 
										else { var len=job.q_a.length;
											   var thisquestion=job.q_a[len-1];
											  /* sendJsonResponse(res, 201, {message:"Successfully Posted"}); }*/
											   sendJsonResponse(res, 201,thisquestion); }
											   }); } 
						});

  }
 else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, provide JobID"});}
//});//callback

};
///////////////////////////////////////////////////////////////////////////////////ADD ANSWER TO EXISTING QUESTION
module.exports.AddAnswer=function(req, res) { //checked
 console.log(req.body);
 if(req.params&&req.params.jobid&&req.params.questionid&&req.body.answer)
 {

	Job.find({_id:req.params.jobid})
	.select('q_a')
	.exec((err,job)=>{ 
							
							 if(!job[0])
				              {sendJsonResponse(res,200,{"message":"API:  Unable to ADD Answer, Job Not Found"}); return;}
				          else if (err) {
								sendJsonResponse(res, 400, err); return; } 
							else {
								var question=job[0].q_a.id(req.params.questionid);
                                if (question===null) {sendJsonResponse(res,404,{"message":"API: Invalid Address, no matching QuestionID"}); return;}
								question.answer.push({
														answer: req.body.answer,
														answerby: req.body.answerby,
														reply:[]  });													
					 			                    	
								
								job[0].save((err,job)=>{
														if (err) { sendJsonResponse(res, 400, err);} 
														else { var thisanswer=job.q_a.id(req.params.questionid).answer[job.q_a.id(req.params.questionid).answer.length-1];
															   sendJsonResponse(res, 201, thisanswer); }   });
					                                      
                                 } 

                            });
 
							

 }
 else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, provide JobID/QuestionID/Answer"});}
};
///////////////////////////////////////////////////////////////////////////////////ADD REPLY TO EXISTING ANSWER
module.exports.AddReply=function(req, res) {  //checked
 if(req.params&&req.params.jobid&&req.params.questionid&&req.params.answerid&&req.body.reply)
 {
 Job.findById(req.params.jobid)
	.select('q_a')
	.exec((err,job)=>{ 
							
							 if(!job)
				              {sendJsonResponse(res,200,{"message":"API: Unable to ADD REPLY, Job Not Found"}); return;}
				            else if(!job.q_a.id(req.params.questionid))
				              {sendJsonResponse(res,200,{"message":"API:  Unable to ADD Reply, Question Not Found"}); return;}
				            else if (err) {
								sendJsonResponse(res, 400, err); return; } 
							else {
								var answer=job.q_a.id(req.params.questionid).answer.id(req.params.answerid);
                                if (answer===null) {sendJsonResponse(res,404,{"message":"API: Invalid Address, no matching AnswerID"}); return;}
								answer.reply.push(
														req.body.reply
														/*author: req.body.author*/  );													
					 			                    	
								
								job.save((err,job)=>{
														if (err) { sendJsonResponse(res, 400, err);} 
														else { var thisreply=job.q_a.id(req.params.questionid).answer.id(req.params.answerid).reply[job.q_a.id(req.params.questionid).answer.id(req.params.answerid).reply.length-1];
															   sendJsonResponse(res, 201, thisreply); }   });
					                                      
                                 } 

                            });

 }
 else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, provide Job ID"});}
};

////////////////////////////////////*Edit*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////EDIT POSTED JOB
module.exports.EditJob=function(req, res) { //checked

 Job
	.findById(req.params.jobid)
	.select('-q_a -applicant')
	.exec( function(err, job) { 
				  
				    if (!job) { sendJsonResponse(res, 404, { "message":"API: Job ID Not found"}); 	return; } 
				     else if (err) { sendJsonResponse(res, 400, err); return; }
					else {
job.companyname= 	req.body.companyname;
job.company_id=     req.body.company_id;
job.postname= 		req.body.postname;
job.jd= 			req.body.jd;
job.job_qual= 		req.body.job_qual;
job.ctc= 			req.body.ctc;
job.easy_apply= 	req.body.easy_apply;
job.place=  		req.body.place;
job.workinghrs= 	req.body.workinghrs;
job.apply_link= 	req.body.apply_link;
job.selection_process= 	req.body.selection_process;
job.pitch= 			req.body.pitch;
job.job_type= 		req.body.job_type;
if(req.body.exp_date)
{job.exp_date=  req.body.exp_date;}   
if (req.body.lng&&req.body.lat)
job.coords= [parseFloat(req.body.lng),parseFloat(req.body.lat)]  ;

				job.save(function(err, location) { 
														if (err) {
														sendJsonResponse(res, 404, err); } 
														else {
														sendJsonResponse(res, 200, job); } });
			        } 
				  
				  
                     }); 
};


///////////////////////////////////////////////////////////////////////////////////EDIT QUESTION FROM POSTED JOB
module.exports.EditQuestion=function(req, res) { //checked

 if(req.params&&req.params.jobid&&req.params.questionid&&req.body.question)
 {

	Job.find({_id:req.params.jobid})
	.select('q_a')
	.exec((err,job)=>{ 
							
				 if(!job[0])
	              {sendJsonResponse(res,200,{"message":"API:  Unable to Edit Question, Job Not Found"}); return;}
	          else if (err) {
					sendJsonResponse(res, 400, err); return; } 
				else {
					var question=job[0].q_a.id(req.params.questionid);
                    if (question===null) {sendJsonResponse(res,404,{"message":"API: Invalid Address, no matching QuestionID"}); return;}
					question.question=req.body.question;													
		 			                    	
					job[0].save((err,job)=>{
											if (err) { sendJsonResponse(res, 400, err);} 
											else { var thisquestion=job.q_a.id(req.params.questionid).question;
												   sendJsonResponse(res, 201, thisquestion); }   });
		                                      
                     } 

                });
 
							

 }
 else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, provide JobID / QuestionID"});}
 };

///////////////////////////////////////////////////////////////////////////////////EDIT ANSWER OF A QUESTION
module.exports.EditAnswer=function(req,res) { //checked
	if(req.params&&req.params.jobid&&req.params.questionid&&req.params.answerid&&req.body.answer)
 {

	Job.find({_id:req.params.jobid})
	.select('q_a')
	.exec((err,job)=>{ 
							
							 if(!job[0])
				              {sendJsonResponse(res,200,{"message":"API:  Unable to Edit Answer, Job Not Found"}); return;}
				          else if (err) {
								sendJsonResponse(res, 400, err); return; } 
							else {
								var question=job[0].q_a.id(req.params.questionid);
                                if (question===null) {sendJsonResponse(res,404,{"message":"API: Invalid Address, no matching QuestionID"}); return;}
								var answer=question.answer.id(req.params.answerid);

								if (answer===null) {sendJsonResponse(res,404,{"message":"API: Invalid Address, no matching AnswerID"}); return;}						
								answer.answer=req.body.answer;																
					 			                    	
								
								job[0].save((err,job)=>{
														if (err) { sendJsonResponse(res, 400, err);} 
														else { 
															   sendJsonResponse(res, 201, answer); }   });
					                                      
                                 } 

                            });
 
							

 }
 else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, provide JobID/QuestionId/AnswerID/Answer"});}
};

///////////////////////////////////////////////////////////////////////////////////WITHDRAW OR APPLY FOR THE APPLICANT INTO JOB
module.exports.EditApplicant=function(req, res) { //checked

 if(req.params&&req.params.jobid&&req.params.task&&ValidID(req.params.applicantid))
 {


	Job.findById(req.params.jobid)
	.select("-q_a")
	.exec((err,job)=>{ 
							
							 if(!job)
				              {sendJsonResponse(res,200,{"message":"API:  Unable to EDIT Applicant, Job Not Found"}); return;}
				          else if (err) {
								sendJsonResponse(res, 400, err); return; } 
							else {

var index=-1;
switch (req.params.task)
{ 
case "apply": {  index=job.applicant.indexOf(req.params.applicantid); 

				if (index===-1)
				{job.applicant.push(req.params.applicantid); }
				break;
			}
case "withdraw": { index=job.applicant.indexOf(req.params.applicantid);
					if (index!==-1)
					{job.applicant.splice(index,1);}
					break;
				}
default : {}

 }
				job.save((err,job)=>{
										if (err) { sendJsonResponse(res, 400, err);} 
										else { sendJsonResponse(res, 200, job); }   });
	                                      
                 }  //end of else

                            }); //end of execute
 
							

 }
 else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, provide JobID/Task/ApplicantID"});}
};

////////////////////////////////////*Remove*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.Delete_AllJobs=function(req, res) {// use to clear data set
  
 Job.findByIdAndRemove({}).exec(function(err, job) {
					                               if (!job) {sendJsonResponse(res, 200, {"message":"API: No Jobs Posted"});}
					                               else  if (err) { sendJsonResponse(res, 404, err); return; }
					                               else  { sendJsonResponse(res, 404, { "message":"API: No jobs"});}	});
				 

};
//-------------------------------------------------------------------------------------------------------------------------
module.exports.Delete_SingleJob=function(req, res) {
  var jobid = req.params.jobid;
      Job
        .findByIdAndRemove(jobid)
		.exec(function(err, job) {            
			                                    if (!job) { sendJsonResponse(res, 200,  {"message":"API:  Job not found"});}
					                              else if (err) { sendJsonResponse(res, 404, err); return; }
					                                     else { sendJsonResponse(res, 404, { "message":"API: Removed Jobid"});}   });
};

//-------------------------------------------------------------------------------------------------------------------------
module.exports.Delete_AllQuestions=function(req, res) {
  var jobid = req.params.jobid;
      Job
        .findById(jobid)
		.exec(function(err, job) {            
			                                    if (!job) { sendJsonResponse(res, 200,  {"message":"API:  Job not found"});}
					                              else if (err) { sendJsonResponse(res, 404, err); return; }
					                                     else { 
 	     job.q_a=[];
 	     job.save((err,job)=>{
										if (err) { sendJsonResponse(res, 400, err);} 
										else { 	sendJsonResponse(res, 200, job); } 
							  });
	                                      
                             }
					                                      });
 };

 //-------------------------------------------------------------------------------------------------------------------------
module.exports.Delete_AllAnswers=function(req, res) {
  var jobid = req.params.jobid;
      Job
        .findById(jobid)
		.exec(function(err, job) {            
			                                    if (!job) { sendJsonResponse(res, 200,  {"message":"API:  Job not found"});}
					                              else if (err) { sendJsonResponse(res, 404, err); return; }
					                                     else { 
 	     var question=job.q_a.id(req.params.questionid);
 	      if (question===null) {sendJsonResponse(res,404,{"message":"API: Invalid Address, no matching QuestionID"}); return;}
 	      question.answer=[];
 	     job.save((err,job)=>{
										if (err) { sendJsonResponse(res, 400, err);} 
										else { 	sendJsonResponse(res, 200, job.q_a); } 
							  });
	                                      
                             }
					                                      });
 };

  //-------------------------------------------------------------------------------------------------------------------------
module.exports.Delete_Question=function(req, res) {
  var jobid = req.params.jobid;
      Job
        .findById(jobid)
		.exec(function(err, job) {            
			                                    if (!job) { sendJsonResponse(res, 200,  {"message":"API:  Job not found"});}
					                              else if (err) { sendJsonResponse(res, 404, err); return; }
					                                     else { 
 	     var question=job.q_a.id(req.params.questionid);
 	      if (question===null) {sendJsonResponse(res,404,{"message":"API: Invalid Address, no matching QuestionID"}); return;}
 	      var index=job.q_a.indexOf(question);
 	      job.q_a.splice(index,1);
 	     job.save((err,job)=>{
										if (err) { sendJsonResponse(res, 400, err);} 
										else { 	sendJsonResponse(res, 200, job.q_a); } 
							  });
	                                      
                             }
					                                      });
 };

   //-------------------------------------------------------------------------------------------------------------------------
module.exports.Delete_Answer=function(req, res) {
  var jobid = req.params.jobid;
      Job
        .findById(jobid)
		.exec(function(err, job) {            
			                                    if (!job) { sendJsonResponse(res, 200,  {"message":"API:  Job not found"});}
					                              else if (err) { sendJsonResponse(res, 404, err); return; }
					                                     else { 
 	     var question=job.q_a.id(req.params.questionid);
 	      if (question===null) {sendJsonResponse(res,404,{"message":"API: Invalid Address, no matching QuestionID"}); return;}
 	     var answer=question.answer.id(req.params.answerid);
 	      if (answer===null) {sendJsonResponse(res,404,{"message":"API: Invalid Address, no matching AnswerID"}); return;}
 	      var index=question.answer.indexOf(answer);
 	      question.answer.splice(index,1);
 	     job.save((err,job)=>{
										if (err) { sendJsonResponse(res, 400, err);} 
										else { 	sendJsonResponse(res, 200, question); } 
							  });
	                                      
                             }
					                                      });
 };



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var sendJsonResponse=function (res,status,content) {
	res.status(status);
	res.json(content);
};

var ValidID= function (){
	
	var args = Array.from(arguments);
    var valid=true;
	args.forEach(function (id){   
	 if(!mongoose.Types.ObjectId.isValid(id))
	 {valid=false; return;}
    
	});
	return valid;
};






















