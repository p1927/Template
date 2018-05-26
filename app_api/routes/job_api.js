var express = require('express');
var router = express.Router();
var jobCtrl = require('../controllers/job_api');


/*var jwt = require('express-jwt');
var auth = jwt({
	secret: process.env.JWT_SECRET,
	userProperty: 'payload'
});*/

/* GET Job pages. */
router.get('/', jobCtrl.AllJobs);
router.get('/nearby', jobCtrl.JobNearBy);
router.get('/:jobid', jobCtrl.SingleJob);
router.get('/:jobid/questions', jobCtrl.AllQuestions);
router.get('/:jobid/questions/:questionid/answers', jobCtrl.AllAnswers);
//router.get('/:jobid/questions/:questionid/:answerid', jobCtrl.SingleAnswer); //dont need this
router.get('/:jobid/applicants', jobCtrl.AllApplicants); 
router.get('/:jobid/applicants/:applicantid', jobCtrl.CheckApplicant);


/* POST Job pages. */
router.post('/', jobCtrl.AddJob);
router.post('/:jobid/questions', jobCtrl.AddQuestion);
router.post('/:jobid/questions/:questionid/answers', jobCtrl.AddAnswer);
router.post('/:jobid/questions/:questionid/:answerid/reply', jobCtrl.AddReply);



/* PUT Job pages. */
router.put('/:jobid', jobCtrl.EditJob);
router.put('/:jobid/questions/:questionid', jobCtrl.EditQuestion);
router.put('/:jobid/questions/:questionid/:answerid', jobCtrl.EditAnswer);
router.put('/:jobid/:task/:applicantid', jobCtrl.EditApplicant); //Add remove applicant
//router.put('/:jobid/questions/:questionid/:answerid/:replyid', jobCtrl.EditReply);


/* DELETE Job pages. */
router.delete('/', jobCtrl.Delete_AllJobs);
router.delete('/:jobid', jobCtrl.Delete_SingleJob);
router.delete('/:jobid/questions', jobCtrl.Delete_AllQuestions);
router.delete('/:jobid/questions/:questionid', jobCtrl.Delete_Question);
router.delete('/:jobid/questions/:questionid/answers', jobCtrl.Delete_AllAnswers);
router.delete('/:jobid/questions/:questionid/:answerid', jobCtrl.Delete_Answer);





module.exports = router;