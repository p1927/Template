var mongoose=require('mongoose');

var User = mongoose.model('User');
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


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////*Read*/////////////////////////////////////////
module.exports.all_Users=function(req, res) {  //done
	
 User.find({})
	.select('name email applicant')
	.exec((err,users)=>{
		if(!users)
			{sendJsonResponse(res,200,[]); return;} // empty array allowed exception
		else if (err) 
			{ console.log("Error API: All Users: ",err);
			  sendJsonResponse(res,200,err); return;}
		else
			{sendJsonResponse(res,200,users);}
	});
/*   var err =new Error("Tou are stupid");
	sendJsonResponse(res,200,err); return;*/
};
//-----------------------------------------------------------------------------------
module.exports.Single_User=function(req, res) {  //done
 if(req.params&&req.params.userid)
 {
	User
	.find({_id:req.params.userid})
	.exec((err,user)=>{
		if(!user)
			{sendJsonResponse(res,200,{"message":"API: User Not Found"}); return;}
		else if (err) 
			{ console.log("Error API: Single User: ",err);
				sendJsonResponse(res,200,err); return;}
		else
			{sendJsonResponse(res,200,user);}
	});}
 else {sendJsonResponse(res,404,{"message":"API: Invalid Address"});}


};


////////////////////////////////////*Write*/////////////////////////////////////////
module.exports.Add_Applicant=function(req, res) {
	
if(req.params&&req.params.userid&&req.body.applicant_detail)
 {
	User
	.findById(req.params.userid)
	.exec((err,user)=>{
		if(!user)
			{sendJsonResponse(res,200,{"message":"API: User Not Found"}); return;}
		else if (err) 
			{ console.log("Error API: Add_Applicant: ",err);
				sendJsonResponse(res,200,err); return;}
		else
			{  user.applicant=true;
			   user.applicant_detail=req.body.applicant_detail;
			    //Api may break if improper object posted
  /*{
        "applicant_detail": {
            "applied": [],
            "favourite": [],
            "_id": "5ad0937b37b6895bc01f68c3",
            "dob": "2012-10-03T18:30:00.000Z",
            "about": "Me",
            "resume": "ddsd",
            "photo": "geell",
            "salary": 3,
            "company": "fdsdf",
            "position": "safd",
            "work_exp": 3
        }}*/
			    
			    user.save((err,user)=>{
										if (err) { sendJsonResponse(res, 400, err);} 
										else { sendJsonResponse(res, 200, user); }   });
            }
	});}
 else {sendJsonResponse(res,404,{"message":"API: Invalid Address"});}


};


////////////////////////////////////*Edit*/////////////////////////////////////////
module.exports.Edit_Applicant=function(req, res) {
// console.log(req.body);
 if(req.params&&req.params.userid&&req.params.task&&mongoose.Types.ObjectId.isValid(req.body.jobid))
 {


	User.findById(req.params.userid)
	.exec((err,user)=>{ 
							
							 if(!user)
				              {sendJsonResponse(res,200,{"message":"API:  Unable to EDIT Applicant, User Not Found"}); return;}
				          else if (err) {
								sendJsonResponse(res, 400, err); return; } 
							else {

var index=-1;
switch (req.params.task)
{ 
case "photo": { user.applicant_detail.photo= req.body.photo_address; break;}
case "resume": { user.applicant_detail.resume= req.body.resume_address; break;}
case "edit": { 
				user.applicant_detail.dob=req.body.dob;
				user.applicant_detail.work_exp=req.body.work_exp;
				user.applicant_detail.about=req.body.about;
				user.applicant_detail.position=req.body.about;
				user.applicant_detail.company=req.body.company;
				user.applicant_detail.salary=req.body.salary;
				break; 
			}
case "mark_favourite": {  index=user.applicant_detail.favourite.indexOf(req.body.jobid);
						  if (index===-1)
						  {user.applicant_detail.favourite.push(req.body.jobid); }
						   break;
						}
case "unmark_favourite": {  index=user.applicant_detail.favourite.indexOf(req.body.jobid);
							if (index!==-1)
							{user.applicant_detail.favourite.splice(index,1);}
                            break;
                        }
case "apply": {  index=user.applicant_detail.applied.indexOf(req.body.jobid);
				if (index===-1)
				{user.applicant_detail.applied.push(req.body.jobid); }
				break;
			}
case "withdraw": {  index=user.applicant_detail.applied.indexOf(req.body.jobid);
					if (index!==-1)
					{user.applicant_detail.applied.splice(index,1);}
					break;
				}
default : {}

 }
				user.save((err,user)=>{
										if (err) { sendJsonResponse(res, 400, err);} 
										else { sendJsonResponse(res, 200, user); }   });
	                                      
                 }  //end of else

                            }); //end of execute
 
							

 }
 else  {sendJsonResponse(res,404,{"message":"API: Invalid Address, provide UserID/Task/JobId"});}
};


////////////////////////////////////*Remove*/////////////////////////////////////////
module.exports.Delete_AllUsers=function(req, res) {// use to clear data set
  
User.findByIdAndRemove({}).exec(function(err, users) {
					                               if (!users) {sendJsonResponse(res, 200, {"message":"API: No Users Exist"});}
					                               else  if (err) { sendJsonResponse(res, 404, err); return; }
					                               else  { sendJsonResponse(res, 404, { "message":"API: No Users"});}	});
				 

};
//-------------------------------------------------------------------------------------------------------------------------
module.exports.Delete_Applicant=function(req, res) { 
 if(req.params&&req.params.userid)
 { 
      User
        .findByIdAndRemove(req.params.userid)
		.exec(function(err, user) {            
			                                    if (!user) { sendJsonResponse(res, 200,  {"message":"API: User not found"});}
					                              else if (err) { sendJsonResponse(res, 404, err); return; }
					                                     else { sendJsonResponse(res, 404, { "message":"API: Removed User"});}   });
}};
//-------------------------------------------------------------------------------------------------------------------------


//Misc Functions-------------------------------------------------------------------------------------------------------------------------

var sendJsonResponse=function (res,status,content) {
	res.status(status);
	res.json(content);
};
























