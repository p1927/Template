var mongoose=require('mongoose');

var Company = mongoose.model('Company');

/////////////////////////////////////////////////////////////////////////////////////////////////////
//All Locations  GET return type  DATA ERR [] 
//REST GET METHODS  return type  DATA ERR MESSAGES
/////////////////////////////////////////////////////////////////////////////////////////////////////



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
//__________________________________________________________setting Averagerating with add review___________________________
var setAvgRating = function (rating,newlength,company) { 
	console.log("API: setAvgRating");
 company.avgrating=parseInt((company.avgrating*(newlength-1)+rating)/newlength);
 company.save((err,company)=>{
	if (err) {console.log('Error API: Rating: ',err);
								return;
									} 
	console.log('Successfully changed Rating');
	return;

  });
};
//____________________________________________________________updating average rating_________________________
var updateAverageRating = function(companyid) {
	Company.findById(companyid)
			.select('avgrating reviews')
			.exec( 	function(err, company) {
					if (!err) {
					 doSetAverageRating(company);
					}
					else console.log("Error API: Updating rating : ",err);
					});
};

var doSetAverageRating = function(company) {
			var i, reviewCount, ratingAverage, ratingTotal;
			if (company.reviews && company.reviews.length > 0) {
			reviewCount = company.reviews.length;
			ratingTotal = 0;
			for (i = 0; i < reviewCount; i++) {
			ratingTotal = ratingTotal + company.reviews[i].rating;
			}
			ratingAverage = parseInt(ratingTotal / reviewCount, 10);
			company.avgrating = ratingAverage;
			company.save(function(err) {
			if (err) {
			console.log("Error API: Error in Updating rating function : ",err);
			
			} else {
			console.log("Average rating updated to", ratingAverage);
			
			}
			});
			}
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//_____________________________________________________________________________________Distance based Company selector
module.exports.allCompaniesNearby=function(req, res) {
	
	var lng=parseFloat(req.query.lng);
	var lat=parseFloat(req.query.lat);
	var maxDis=parseFloat(req.query.distance);
	

	Company.aggregate( 
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
	var companies=[];
	results.forEach( function(doc) { 


	companies.push(doc);


	Company.findById(doc._id).exec((err,company)=>{company.distance=doc.distance; 
																	company.save((err,company)=>{ 
																		if (err) { console.log("Error API: Saving distance in Company: ",err);
																		
																		sendJsonResponse(res, 400, err);} 
																	  });		
																					});

			});

	if (companies[0])sendJsonResponse(res,200,companies);
	else 	sendJsonResponse(res,200,[]);
        }
    );
};

////////////////////////////////////*Read*/////////////////////////////////////////
module.exports.allCompanies=function(req, res) {  //checked
	
 Company.find({})
	.select('-q_a -salaries -reviews -jobs')
	.exec((err,company)=>{
		/*if(!company)
			{sendJsonResponse(res,200,[]); return;} // empty array allowed exception
		else*/ if (err) 
			{ console.log("Error API: allCompanies: ",err);
			  sendJsonResponse(res,200,err); return;}
		else
			{sendJsonResponse(res,200,company);}
	});
/*   var err =new Error("Tou are stupid");
	sendJsonResponse(res,200,err); return;*/
};
//-----------------------------------------------------------------------------------
module.exports.Singlecompany=function(req, res) {
 if(req.params&&req.params.companyid)
 {
	Company
	.findById(req.params.companyid)
	.exec((err,company)=>{
		if(!company)
			{sendJsonResponse(res,200,{"message":"API: Company Not Found"}); return;}
		else if (err) 
			{ console.log("Error API: Singlecompany: ",err);
				sendJsonResponse(res,200,err); return;}
		else
			{sendJsonResponse(res,200,company);}
	});}
 else {sendJsonResponse(res,404,{"message":"API: Invalid Address"});}


};
//-----------------------------------------------------------------------------------//Recent Reviews to added
module.exports.AllReviews=function(req, res) {
 if(req.params&&req.params.companyid)
	{Company.find({_id:req.params.companyid})
		.select('-salaries -q_a -jobs')
		.exec((err,reviews)=>{
			if(!reviews[0])
				{sendJsonResponse(res,200,{"message":"API: Company Not Found"}); return;}
			else if (err) 
				{console.log("Error API: AllReviews: ",err);
					sendJsonResponse(res,200,err); return;}
			else
				{ sendJsonResponse(res,200,reviews[0]);}
		});}
 else {sendJsonResponse(res,404,{"message":"API: Invalid Address"});}

 
};
//-----------------------------------------------------------------------------------
module.exports.SingleReviews=function(req, res) {
 if(req.params&&ValidID(req.params.companyid,req.params.reviewid))
 {
 Company.find({_id:req.params.companyid})
	.select('reviews')
	.exec((err,company)=>{  // cases error, empty array, data
							if (err) {
								sendJsonResponse(res, 400, err); return; } 
							else if(!company[0])
				              {sendJsonResponse(res,200,{"message":"API: Company Not Found"}); return;}
							else {
									var review=company[0].reviews.id(req.params.reviewid);
									if(!review)
										{sendJsonResponse(res,200,{"message":"API: Review Not Found"}); return;}
									else
										{sendJsonResponse(res,200,review);}  } 
		                   });
 }
	else {sendJsonResponse(res,404,{"message":"API: Invalid Address"});}
};
//-----------------------------------------------------------------------------------
module.exports.AllComments=function(req, res) {
 if(req.params&&req.params.companyid&&req.params.reviewid)
	{
 Company.find({_id:req.params.companyid})
	.select('reviews')
	.exec((err,company)=>{ 
							if (err) {
								sendJsonResponse(res, 400, err); return; } 
							else if(!company[0])
				              {sendJsonResponse(res,200,{"message":"API: Company Not Found"}); return;}
							else {
									var review=company[0].reviews.id(req.params.reviewid);
									if(!review)
										{sendJsonResponse(res,200,{"message":"API: Review Not Found"}); return;}
									else
										{sendJsonResponse(res,200,review.comments);}  } 
		                   });
   }
 else {sendJsonResponse(res,404,{"message":"API: Invalid Address"});}

};
//-----------------------------------------------------------------------------------
module.exports.SingleComment=function(req, res) {  //not used
 if(req.params&&req.params.companyid&&req.params.reviewid&&req.params.commentid)
 {

	Company.find({_id:req.params.companyid})
	.select('reviews')
	.exec((err,company)=>{ 
							if (err) {
								sendJsonResponse(res, 400, err); return; } 
							else if(!company[0])
				              {sendJsonResponse(res,200,{"message":"API: Company Not Found"}); return;}
				            else if(!company[0].reviews.id(req.params.reviewid))
				              {sendJsonResponse(res,200,{"message":"API:  Review Not Found"}); return;}
							else {
								var comment=company[0].reviews.id(req.params.reviewid).comments.id(req.params.commentid);
								if(!comment)
									{sendJsonResponse(res,200,{"message":"API: Comment Not Found"}); return;}
								else
									{sendJsonResponse(res,200,comment);} }  });
	}
 else {sendJsonResponse(res,404,{"message":"API: Invalid Address"});}
};
//-----------------------------------------------------------------------------------
///////////////////////////////////////////////////////////////////////////////////QUESTIONS OF PARTICULAR JOB
module.exports.AllQuestions=function(req, res) {
 if(req.params&&ValidID(req.params.companyid))
	{Company.find({_id:req.params.companyid})
		.select('q_a')
		.exec((err,company)=>{ 
			if(!company[0])
				{sendJsonResponse(res,200,{"message":"API: Company Not Found"}); return;}
			var questions= company[0].q_a; console.log(company);
			if(!questions)
				{sendJsonResponse(res,200,{"message":"API: Questions Not Found"}); return;}
			else if (err) 
				{console.log("Error API: All Questions: ",err);
					sendJsonResponse(res,200,err); return;}
			else
				{ sendJsonResponse(res,200,questions);}
		}); }
 else {sendJsonResponse(res,404,{"message":"API: Invalid Address All Questions"});}

 
};
///////////////////////////////////////////////////////////////////////////////////ANSWERS OF PARTICULAR QUESTION
module.exports.AllAnswers=function(req, res) {
 if(req.params&&ValidID(req.params.companyid,req.params.questionid))
	{Company.find({_id:req.params.companyid})
		.select('q_a')
		.exec((err,company)=>{
			if(!company[0])
				{sendJsonResponse(res,200,{"message":"API: Company Not Found"}); return;}
			var question=company[0].q_a.id(req.params.questionid);
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

///////////////////////////////////////////////////////////////////////////////////ANSWERS OF PARTICULAR QUESTION
module.exports.Allsalaries=function(req, res) { 
 if(req.params&&ValidID(req.params.companyid))
	{Company.find({_id:req.params.companyid})
		.select('-q_a -reviews -jobs')
		.exec((err,company)=>{
			if(!company[0])
				{sendJsonResponse(res,200,{"message":"API: Company Not Found"}); return;}
			else if (err) 
				{console.log("Error API: All Salaries: ",err);
					sendJsonResponse(res,200,err); return;}
			else
				{ sendJsonResponse(res,200,company[0]);}
		});}
 else {sendJsonResponse(res,404,{"message":"API: Invalid Address"});}

 
};

////////////////////////////////////*Write*/////////////////////////////////////////
module.exports.AddCompany=function(req, res) {
	
	Company.create({
companyname: 	req.body.companyname,
tagline: 		req.body.tagline,
about: 		    req.body.about,
logo: 			req.body.logo,
photos: 		req.body.photos, //array
address:  		req.body.address,	
workinghrs: 	req.body.workinghrs,
email: 			req.body.email,	
website: 		req.body.website,	
telephone: 		req.body.telephone,	
coords: 		[parseFloat(req.body.lng),parseFloat(req.body.lat)]

	 			},
	(err,company)=>{

					if (err) {  console.log('Error API: Add Company: ',err);
						sendJsonResponse(res, 400, err); } 
					else { 	
						sendJsonResponse(res, 201, company); }
				    });
};
//=====================================================================
module.exports.AddReview=function(req, res) {
/*getAuthor (req,res,function (req,res,username)
{*/ if(req.params&&req.params.companyid&&req.body.review)
  { 
    Company.findById(req.params.companyid)
	.select('avgrating reviews')
	.exec(function (err,company){
						 
							 if(!company)
				              {sendJsonResponse(res,200,{"message":"API: Unable to ADD REVIEW, Company Not Found"}); return;}
				             else if (err) {
							   sendJsonResponse(res, 400, err);
							   }
							else {

							company.reviews.push({ 
											reviewtitle: req.body.review.reviewtitle,
											rating: req.body.review.rating,
											review: req.body.review.review,
											author: "username" });
							company.save((err,company)=>{
										if (err) { sendJsonResponse(res, 400, err); 
											console.log('Error API: AddReview: ',err);} 
										else { var len=company.reviews.length;
											   var thisreview=company.reviews[len-1];
											   setAvgRating(thisreview.rating,len,company);
											  /* sendJsonResponse(res, 201, {message:"Successfully Posted"}); }*/
											   sendJsonResponse(res, 201, thisreview); }
											   }); } 
						});

 }
 else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, provide Company ID"});}
//});//callback

};
//====================================================================================
module.exports.AddComment=function(req, res) {
 
 if(req.params&&req.params.companyid&&req.params.reviewid)
 {

	Company.find({_id:req.params.companyid})
	.select('reviews')
	.exec((err,company)=>{ 
							
							 if(!company[0])
				              {sendJsonResponse(res,200,{"message":"API:  Unable to ADD COMMENT, Company Not Found"}); return;}
				          else if (err) {
								sendJsonResponse(res, 400, err); return; } 
							else {
								var review=company[0].reviews.id(req.params.reviewid);
                                if (review===null) {sendJsonResponse(res,404,{"message":"API: Invalid Address, no matching reviewID"}); return;}
								review.comments.push({
														comment: req.body.comment,
														author: req.body.author  });													
					 			                    	
								review.commentnos++;
								company[0].save((err,company)=>{
														if (err) { sendJsonResponse(res, 400, err);} 
														else { var thiscomment=company.reviews.id(req.params.reviewid).comments[company.reviews.id(req.params.reviewid).comments.length-1];
															   sendJsonResponse(res, 201, thiscomment); }   });
					                                      
                                 } 

                            });
 
							

 }
 else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, provide Company ID"});}
};
//===================================================================================================
///////////////////////////////////////////////////////////////////////////////////ADD SALARIES TO COMPANY
module.exports.AddSalary=function(req, res) { //checked
//getAuthor (req,res,function (req,res,username){
 if(req.params&&req.params.companyid&&req.body.salary)
  { 
    Company.findById(req.params.companyid)
	.select('salaries')
	.exec(function (err,company){
						 
							 if(!company)
				              {sendJsonResponse(res,200,{"message":"API: Unable to ADD Salary, Company Not Found"}); return;}
				             else if (err) {
							   sendJsonResponse(res, 400, err);
							   }
							else {

							company.salaries.push({ 	
								location:  	req.body.salary.location,
								salary: req.body.salary.salary,
								desg: req.body.salary.desg});
							company.save((err,company)=>{
										if (err) { sendJsonResponse(res, 400, err); 
											console.log('Error API: Add Salary: ',err);} 
										else { var len=company.salaries.length;
											   var thissalary=company.salaries[len-1];
											  /* sendJsonResponse(res, 201, {message:"Successfully Posted"}); }*/
											   sendJsonResponse(res, 201,thissalary); }
											   }); } 
						});

  }
 else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, provide CompanyID"});}
//});//callback

};
///////////////////////////////////////////////////////////////////////////////////ADD QUESTION TO POSTED JOB
module.exports.AddQuestion=function(req, res) { //checked
//getAuthor (req,res,function (req,res,username){
 if(req.params&&req.params.companyid&&req.body.question)
  { 
    Company.findById(req.params.companyid)
	.select('q_a')
	.exec(function (err,company){
						 
							 if(!company)
				              {sendJsonResponse(res,200,{"message":"API: Unable to ADD Question, Company Not Found"}); return;}
				             else if (err) {
							   sendJsonResponse(res, 400, err);
							   }
							else {

							company.q_a.push({ 	question: req.body.question,
										    answer: [],
										    askedby: "username"});
							company.save((err,company)=>{
										if (err) { sendJsonResponse(res, 400, err); 
											console.log('Error API: Add Question: ',err);} 
										else { var len=company.q_a.length;
											   var thisquestion=company.q_a[len-1];
											  /* sendJsonResponse(res, 201, {message:"Successfully Posted"}); }*/
											   sendJsonResponse(res, 201,thisquestion); }
											   }); } 
						});

  }
 else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, provide Company ID"});}
//});//callback

};
///////////////////////////////////////////////////////////////////////////////////ADD ANSWER TO EXISTING QUESTION
module.exports.AddAnswer=function(req, res) { //checked
 console.log(req.body);
 if(req.params&&req.params.companyid&&req.params.questionid&&req.body.answer)
 {

	Company.find({_id:req.params.companyid})
	.select('q_a')
	.exec((err,company)=>{ 
							
							 if(!company[0])
				              {sendJsonResponse(res,200,{"message":"API:  Unable to ADD Answer, Company Not Found"}); return;}
				          else if (err) {
								sendJsonResponse(res, 400, err); return; } 
							else {
								var question=company[0].q_a.id(req.params.questionid);
                                if (question===null) {sendJsonResponse(res,404,{"message":"API: Invalid Address, no matching QuestionID"}); return;}
								question.answer.push({
														answer: req.body.answer,
														answerby: req.body.answerby
														  });													
					 			                    	
								
								company[0].save((err,company)=>{
														if (err) { sendJsonResponse(res, 400, err);} 
														else { var thisanswer=company.q_a.id(req.params.questionid).answer[company.q_a.id(req.params.questionid).answer.length-1];
															   sendJsonResponse(res, 201, thisanswer); }   });
					                                      
                                 } 

                            });
 
							

 }
 else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, provide CompanyID/QuestionID/Answer"});}
};

////////////////////////////////////*Edit*/////////////////////////////////////////
module.exports.EditCompany=function(req, res) {

 Company
	.findById(req.params.companyid)
	.select('-reviews -avgrating -jobs -salaries -q_a')
	.exec( function(err, company) { 
				  
				    if (!company) { sendJsonResponse(res, 404, { "message":"API: Company ID Not found"}); 	return; } 
				     else if (err) { sendJsonResponse(res, 400, err); return; }
					else {
company.companyname= 	req.body.companyname;
company.tagline= 		req.body.tagline;
company.about= 		    req.body.about;
company.logo= 			req.body.logo;
company.photos= 		req.body.photos; //array
company.address=  		req.body.address;	
company.workinghrs= 	req.body.workinghrs;
company.email= 			req.body.email;	
company.website= 		req.body.website;	
company.telephone= 		req.body.telephone;	
company.coords= 		[parseFloat(req.body.lng),parseFloat(req.body.lat)];

							
							company.save(function(err, company) { 
																	if (err) {
																	sendJsonResponse(res, 404, err); } 
																	else {
																	sendJsonResponse(res, 200, company); } });
						        } 
				  
				  
                     }); 
};


//-------------------------------------------------------------------------------------------------------------------------
module.exports.EditReviews=function(req, res) {

 Company
	.findById(req.params.companyid)
	.select('avgrating reviews')
	.exec( function(err, company) { 
					var thisReview;
					
				     if (!company) { sendJsonResponse(res, 404, { "message":"API: Company ID Not found"}); 	return; } 
				     else if (err) { sendJsonResponse(res, 400, err); return; }
					if (company.reviews && company.reviews.length > 0) {
							thisReview = company.reviews.id(req.params.reviewid);
							if (!thisReview) { 	sendJsonResponse(res, 404, { "message":"API: Reviewid not found" }); 	} 
							else {
							thisReview.reviewtitle = req.body.reviewtitle;	
							thisReview.author = req.body.author;
							thisReview.rating = req.body.rating;
							thisReview.review = req.body.review;
							thisReview.reviewdate = Date();
							company.save(function(err, company) { 
																	if (err) {
																	sendJsonResponse(res, 404, err); } 
																	else {
																	updateAverageRating(company._id);
																	sendJsonResponse(res, 200, thisReview); } });
						        } 
				      }
				    else { sendJsonResponse(res, 404, { "message":"API: No review to update" }); }
       });
};

///////////////////////////////////////////////////////////////////////////////////POSTED JOBS FROM A COMPANY
module.exports.EditJob=function(req, res) { //checked

 if(req.params&&ValidID(req.params.companyid,req.params.jobid))
 {


	Company.findById(req.params.companyid)
	.select("jobs")
	.exec((err,company)=>{ 
							
							 if(!company)
				              {sendJsonResponse(res,200,{"message":"API:  Unable to EDIT Posted Jobs, Company Not Found"}); return;}
				          else if (err) {
								sendJsonResponse(res, 400, err); return; } 
							else {

var index=company.jobs.indexOf(req.params.jobid); 
switch (req.params.task)
{ 
case "add": {  	if (index===-1)
				{company.jobs.push(req.params.jobid); }
				break;
			}
case "remove": { 	if (index!==-1)
					{company.jobs.splice(index,1);}
					break;
				}
default : {}

 }
				company.save((err,company)=>{
										if (err) { sendJsonResponse(res, 400, err);} 
										else { sendJsonResponse(res, 200, company.jobs); }   });
	                                      
                 }  //end of else

                            }); //end of execute
 
							

 }
 else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, provide CompanyID/JobID/Task"});}
};

///////////////////////////////////////////////////////////////////////////////////EDIT QUESTION FROM POSTED JOB
module.exports.EditSalary=function(req, res) { //checked  REQ.BODY={SALARY OBJECT}

 if(req.params&&ValidID(req.params.companyid,req.params.salaryid)&&req.body.salary)
 {

	Company.find({_id:req.params.companyid})
	.select('salaries')
	.exec((err,company)=>{ 
							
				 if(!company[0])
	              {sendJsonResponse(res,200,{"message":"API:  Unable to Edit Salaries, Company Not Found"}); return;}
	          else if (err) {
					sendJsonResponse(res, 400, err); return; } 
				else {
					var salary=company[0].salaries.id(req.params.salaryid);
                    if (salary===null) {sendJsonResponse(res,404,{"message":"API: Invalid Address, no matching SalaryID"}); return;}
					salary.location=req.body.salary.location;
					salary.salary=parseFloat(req.body.salary.salary);
					salary.desg=req.body.salary.desg;
								 			                    	
					company[0].save((err,company)=>{
											if (err) { sendJsonResponse(res, 400, err);} 
											else { var thissalary=company.salaries.id(req.params.salaryid);
												   sendJsonResponse(res, 201, thissalary); }   });
		                                      
                     } 

                });
 
							

 }
 else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, provide CompanyID / SalaryID"});}
 };

///////////////////////////////////////////////////////////////////////////////////EDIT QUESTION about COMPANY
module.exports.EditQuestion=function(req, res) { //checked

 if(req.params&&req.params.companyid&&req.params.questionid&&req.body.question) //REQ.BODY={question}
 {

	Company.find({_id:req.params.companyid})
	.select('q_a')
	.exec((err,company)=>{ 
							
				 if(!company[0])
	              {sendJsonResponse(res,200,{"message":"API:  Unable to Edit Question, Company Not Found"}); return;}
	          else if (err) {
					sendJsonResponse(res, 400, err); return; } 
				else {
					var question=company[0].q_a.id(req.params.questionid);
                    if (question===null) {sendJsonResponse(res,404,{"message":"API: Invalid Address, no matching QuestionID"}); return;}
					question.question=req.body.question;													
		 			                    	
					company[0].save((err,company)=>{
											if (err) { sendJsonResponse(res, 400, err);} 
											else { var thisquestion=company.q_a.id(req.params.questionid).question;
												   sendJsonResponse(res, 201, thisquestion); }   });
		                                      
                     } 

                });
 
							

 }
 else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, provide CompanyID / QuestionID"});}
 };

///////////////////////////////////////////////////////////////////////////////////EDIT ANSWER OF A QUESTION
module.exports.EditAnswer=function(req,res) { //checked  
	if(req.params&&req.params.companyid&&req.params.questionid&&req.params.answerid)
 {

	Company.find({_id:req.params.companyid})
	.select('q_a')
	.exec((err,company)=>{ 
							
							 if(!company[0])
				              {sendJsonResponse(res,200,{"message":"API:  Unable to Edit Answer, Company Not Found"}); return;}
				          else if (err) {
								sendJsonResponse(res, 400, err); return; } 
							else {
								var question=company[0].q_a.id(req.params.questionid);
                                if (question===null) {sendJsonResponse(res,404,{"message":"API: Invalid Address, no matching QuestionID"}); return;}
								var answer=question.answer.id(req.params.answerid);

								if (answer===null) {sendJsonResponse(res,404,{"message":"API: Invalid Address, no matching AnswerID"}); return;}						
																							
//--------------------	
switch (req.params.task)
{ 
case "upvote": { if(req.body.increment==true) answer.upvote++;
				 else answer.upvote--; break;}  //frontend downvote + upvote simultaneous check, //req.body.increment required.
case "downvote": { if(req.body.increment==true) answer.downvote++;
				 else answer.downvote--; break;}
case "flag": { if(answer.flag==false) answer.flag=true; //TOGGLE FLAGS
	           else answer.flag=false;
				break; 
			}
case "edit": {  answer.answer=req.body.answer;	  //REQ.BODY={ANSWER}
						   break;
						}
default : {}

 }				 			                    	
//--------------------								
								company[0].save((err,company)=>{
														if (err) { sendJsonResponse(res, 400, err);} 
														else { 
															   sendJsonResponse(res, 201, answer); }   });
					                                      
                                 } 

                            });
 
							

 }
 else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, provide CompanyID/QuestionId/AnswerID/Task"});}
};

////////////////////////////////////*Remove*/////////////////////////////////////////
module.exports.Delete_AllCompanies=function(req, res) {// use to clear data set
  
 Company.findByIdAndRemove({}).exec(function(err, company) {
					                               if (!company) {sendJsonResponse(res, 200, {"message":"API: No Companies Exist"});}
					                               else  if (err) { sendJsonResponse(res, 404, err); return; }
					                               else  { sendJsonResponse(res, 404, { "message":"API: No companies"});}	});
				 

};
//-------------------------------------------------------------------------------------------------------------------------
module.exports.Delete_SingleCompany=function(req, res) {
  var companyid = req.params.companyid;
      Company
        .findByIdAndRemove(companyid)
		.exec(function(err, company) {            
			                                    if (!company) { sendJsonResponse(res, 200,  {"message":"API:  Company Data not found"});}
					                              else if (err) { sendJsonResponse(res, 404, err); return; }
					                                     else { sendJsonResponse(res, 404, { "message":"API: Removed companyid"});}   });
};
//-------------------------------------------------------------------------------------------------------------------------
module.exports.Delete_AllReviews=function(req, res) {
 
 if(req.params&&req.params.companyid)
 { 
 Company.findById(req.params.companyid)
	.select('reviews')
	.exec(function (err,company){

			                if (!company) { sendJsonResponse(res, 200,  {"message":"API:  Company Data not found"});}
							else if (err) { sendJsonResponse(res, 400, err);} 
							else {
                          if (company.reviews[0])
							{company.reviews.forEach((element)=>{element.remove();});
														company.avgrating=0;
														company.save((err,company)=>{
																	if (err) { sendJsonResponse(res, 400, err);  } 
																	else { sendJsonResponse(res, 200,{"message":"API: Removed All Reviews Data"}); }   });}
								else  {sendJsonResponse(res,404,{"message":"API: No reviews to Remove"});}
								 } 
						 });

 }
 else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, provide CompanyID"});}

};
//-------------------------------------------------------------------------------------------------------------------------
module.exports.Delete_SingleReviews=function(req, res) {
 
 if(req.params&&req.params.companyid&&req.params.reviewid)
 { 
 Company.findById(req.params.companyid)
	.select('reviews')
	.exec(function (err,company){

						if (!company) { 
							sendJsonResponse(res, 200,  {"message":"API: Company Data not found"});}
						  else if (err) {sendJsonResponse(res, 400, err);	} 
							else {
 if(company.reviews.id(req.params.reviewid))
							{company.reviews.id(req.params.reviewid).remove();
														company.save((err,company)=>{
																	if (err) { sendJsonResponse(res, 400, err); }
																		
																	else { updateAverageRating(company._id);
																		
																		sendJsonResponse(res, 200,{"message":"API: Removed Review Data"}); }   });}
										else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, Invalid ReviewID"});}
								 } 
						 });

 }
 else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, provide CompanyID / ReviewID"});}

};
//-------------------------------------------------------------------------------------------------------------------------
module.exports.Delete_AllComments=function(req, res) {
 
 if(req.params&&req.params.companyid&&req.params.reviewid)
 { 
 Company.findById(req.params.companyid)
	.select('reviews')
	.exec(function (err,company){
							 if (!company) { sendJsonResponse(res, 200,  {"message":"API: Company Data not found"});}
							else  if (!company.reviews.id(req.params.reviewid)) { sendJsonResponse(res, 200,  {"message":"API: Review Data not found"});}
							else if (err) { sendJsonResponse(res, 400, err);} 
							else {
                       if(company.reviews.id(req.params.reviewid).comments[0])
							{ company.reviews.id(req.params.reviewid).comments.forEach((element)=>{element.remove();});
														company.reviews.id(req.params.reviewid).commentnos=0;
														company.save((err,company)=>{
																	if (err) { sendJsonResponse(res, 400, err); }
																		
																	else { 
																		sendJsonResponse(res, 200,{"message":"API: Removed All Comment Data"}); }   });}
														else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, No comments"});}
								 } 
						 });

 }
 else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, provide CompanyID / ReviewID"});}
};
//-------------------------------------------------------------------------------------------------------------------------
module.exports.Delete_SingleComment=function(req, res) {
 
 if(req.params&&req.params.companyid&&req.params.reviewid&&req.params.commentid)
 { 
 Company.findById(req.params.companyid)
	.select('reviews')
	.exec(function (err,company){
							if (!company) { 
							 sendJsonResponse(res, 200,  {"message":"API: Company Data not found"});}
							else  if (!company.reviews.id(req.params.reviewid)) { 
								sendJsonResponse(res, 200,  {"message":"API: Review Data not found"});}
							else if (err) {	
								sendJsonResponse(res, 400, err); } 
							else {
 if(company.reviews.id(req.params.reviewid).comments.id(req.params.commentid))
							{company.reviews.id(req.params.reviewid).comments.id(req.params.commentid).remove();
														company.reviews.id(req.params.reviewid).commentnos--;
														company.save((err,company)=>{
																	if (err) { sendJsonResponse(res, 400, err); }
																		
																	else { 
																		sendJsonResponse(res, 200,{"message":"API: Removed Comment Data"}); }   });}
														else {sendJsonResponse(res,404,{"message":"API: Invalid Address, Invalid CommentID"});}
								 } 
						 });

 } 
 else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, provide CompanyID / ReviewID/ CommentID"});}

};

  //-------------------------------------------------------------------------------------------------------------------------
module.exports.Delete_Salary=function(req, res) {
  var companyid = req.params.companyid;
      Company
        .findById(companyid)
		.exec(function(err, company) {            
			                                    if (!company) { sendJsonResponse(res, 200,  {"message":"API:  Company not found"});}
					                              else if (err) { sendJsonResponse(res, 404, err); return; }
					                                     else { 
 	     var salary=company.salaries.id(req.params.salaryid);
 	      if (salary===null) {sendJsonResponse(res,404,{"message":"API: Invalid Address, no matching SalaryID"}); return;}
 	      var index=company.salaries.indexOf(salary);
 	      company.salaries.splice(index,1);
 	     company.save((err,company)=>{
										if (err) { sendJsonResponse(res, 400, err);} 
										else { 	sendJsonResponse(res, 200, company.salaries); } 
							  });
	                                      
                             }
					                                      });
 };
//-------------------------------------------------------------------------------------------------------------------------
module.exports.Delete_AllQuestions=function(req, res) {
  var companyid = req.params.companyid;
      Company
        .findById(companyid)
		.exec(function(err, company) {            
			                                    if (!company) { sendJsonResponse(res, 200,  {"message":"API:  Company not found"});}
					                              else if (err) { sendJsonResponse(res, 404, err); return; }
					                                     else { 
 	     company.q_a=[];
 	     company.save((err,company)=>{
										if (err) { sendJsonResponse(res, 400, err);} 
										else { 	sendJsonResponse(res, 200, company); return; } 
							  });
	                                      
                             }
					                                      });
  };

 //-------------------------------------------------------------------------------------------------------------------------
module.exports.Delete_AllAnswers=function(req, res) {
  var companyid = req.params.companyid;
      Company
        .findById(companyid)
		.exec(function(err, company) {            
			                                    if (!company) { sendJsonResponse(res, 200,  {"message":"API:  Company not found"});}
					                              else if (err) { sendJsonResponse(res, 404, err); return; }
					                                     else { 
 	     var question=company.q_a.id(req.params.questionid);
 	      if (question===null) {sendJsonResponse(res,404,{"message":"API: Invalid Address, no matching QuestionID"}); return;}
 	      question.answer=[];
 	     company.save((err,company)=>{
										if (err) { sendJsonResponse(res, 400, err);} 
										else { 	sendJsonResponse(res, 200, company.q_a); } 
							  });
	                                      
                             }
					                                      });
 };

  //-------------------------------------------------------------------------------------------------------------------------
module.exports.Delete_Question=function(req, res) {
  var companyid = req.params.companyid;
      Company
        .findById(companyid)
		.exec(function(err, company) {            
			                                    if (!company) { sendJsonResponse(res, 200,  {"message":"API:  Company not found"});}
					                              else if (err) { sendJsonResponse(res, 404, err); return; }
					                                     else { 
 	     var question=company.q_a.id(req.params.questionid);
 	      if (question===null) {sendJsonResponse(res,404,{"message":"API: Invalid Address, no matching QuestionID"}); return;}
 	      var index=company.q_a.indexOf(question);
 	      company.q_a.splice(index,1);
 	     company.save((err,company)=>{
										if (err) { sendJsonResponse(res, 400, err);} 
										else { 	sendJsonResponse(res, 200, company.q_a); } 
							  });
	                                      
                             }
					                                      });
 };

   //-------------------------------------------------------------------------------------------------------------------------
module.exports.Delete_Answer=function(req, res) {
  var companyid = req.params.companyid;
      Company
        .findById(companyid)
		.exec(function(err, company) {            
			                                    if (!company) { sendJsonResponse(res, 200,  {"message":"API:  Company not found"});}
					                              else if (err) { sendJsonResponse(res, 404, err); return; }
					                                     else { 
 	     var question=company.q_a.id(req.params.questionid);
 	      if (question===null) {sendJsonResponse(res,404,{"message":"API: Invalid Address, no matching QuestionID"}); return;}
 	     var answer=question.answer.id(req.params.answerid);
 	      if (answer===null) {sendJsonResponse(res,404,{"message":"API: Invalid Address, no matching AnswerID"}); return;}
 	      var index=question.answer.indexOf(answer);
 	      question.answer.splice(index,1);
 	     company.save((err,company)=>{
										if (err) { sendJsonResponse(res, 400, err);} 
										else { 	sendJsonResponse(res, 200, question); } 
							  });
	                                      
                             }
					                                      });
 };


//-----------------------------------------------------------------------------------------------Update Likes--------------------------
module.exports.UpdateUpvotes=function(req, res) {  // user name pass schema link with like button

if(req.body.increment===undefined){sendJsonResponse(res, 404, { "message":"API: No increment"}); 	return; };

 var updateentity;
 Company
	.findById(req.params.companyid)
	.select('reviews')
	.exec( function(err, company) { 
					var thisReview;
					
				     if (!company) { sendJsonResponse(res, 404, { "message":"API: Company ID Not found"}); 	return; } 
				     else if (err) { sendJsonResponse(res, 400, err); return; }
					if (company.reviews && company.reviews.length > 0) { 
							thisReview = company.reviews.id(req.params.reviewid);
							if (!thisReview) { 	sendJsonResponse(res, 404, { "message":"API: Reviewid not found" }); return; 	} 
							else { updateentity=thisReview;
                            /*if (req.params.commentid&&thisReview.comments && thisReview.comments.length > 0) {
							thisComment = thisReview.comments.id(req.params.commentid);
							if (!thisComment) { 	sendJsonResponse(res, 404, { "message":"API: Commentid not found" }); return;  }
                             else  updateentity=thisComment; }*/ // comment->upvotes not present here so discarded


								if(req.body.increment==true)
							    updateentity.upvotes++;	
							    else updateentity.upvotes--;	
			
							company.save(function(err, company) { 
																	if (err) {
																	sendJsonResponse(res, 404, err); } 
																	else {
																	console.log("success");
																	sendJsonResponse(res, 200, { "message":"API: Upvotes updated" }); } });
						        } 
				      }
				    else { sendJsonResponse(res, 404, { "message":"API: No review to update" }); }
       });
};

//-------------------------------------------------------------------------------------------------------------------------

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























