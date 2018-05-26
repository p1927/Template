var express = require('express');
var router = express.Router();
var companyCtrl = require('../controllers/company_api');

/*
var jwt = require('express-jwt');
var auth = jwt({
	secret: process.env.JWT_SECRET,
	userProperty: 'payload'
});*/

/* GET Company pages. */
router.get('/', companyCtrl.allCompanies);
router.get('/nearby', companyCtrl.allCompaniesNearby);
router.get('/:companyid', companyCtrl.Singlecompany);
router.get('/:companyid/reviews', companyCtrl.AllReviews);
router.get('/:companyid/reviews/:reviewid', companyCtrl.SingleReviews);
router.get('/:companyid/reviews/:reviewid/comments', companyCtrl.AllComments);
//router.get('/:companyid/:reviewid/:commentid', companyCtrl.SingleComment);
router.get('/:companyid/questions', companyCtrl.AllQuestions);
router.get('/:companyid/questions/:questionid/answers', companyCtrl.AllAnswers);
//router.get('/:companyid/questions/:questionid/:answerid', companyctrl.SingleAnswer);
router.get('/:companyid/salaries', companyCtrl.Allsalaries); 


/* POST Company pages. */
router.post('/', companyCtrl.AddCompany);
router.post('/:companyid/review', companyCtrl.AddReview);
router.post('/:companyid/reviews/:reviewid/comment', companyCtrl.AddComment);
router.post('/:companyid/salaries', companyCtrl.AddSalary);
router.post('/:companyid/questions', companyCtrl.AddQuestion);
router.post('/:companyid/questions/:questionid/answers', companyCtrl.AddAnswer);



/* PUT Company pages. */
router.put('/:companyid', companyCtrl.EditCompany);
router.put('/:companyid/reviews/:reviewid', companyCtrl.EditReviews);
router.put('/:companyid/reviews/:reviewid/upvotes', companyCtrl.UpdateUpvotes); //set up req.body.increment
router.put('/:companyid/salaries/:salaryid', companyCtrl.EditSalary);
router.put('/:companyid/jobs/:task/:jobid', companyCtrl.EditJob);      //task: Add Remove Job
router.put('/:companyid/questions/:questionid', companyCtrl.EditQuestion);
router.put('/:companyid/questions/:questionid/:task/:answerid', companyCtrl.EditAnswer);
//task : upvote downvote flag edit

/* DELETE Company pages. */
router.delete('/', companyCtrl.Delete_AllCompanies);
router.delete('/:companyid', companyCtrl.Delete_SingleCompany);
router.delete('/:companyid/reviews', companyCtrl.Delete_AllReviews);
router.delete('/:companyid/reviews/:reviewid', companyCtrl.Delete_SingleReviews);
router.delete('/:companyid/reviews/:reviewid/comments', companyCtrl.Delete_AllComments);
router.delete('/:companyid/reviews/:reviewid/:commentid', companyCtrl.Delete_SingleComment);
router.delete('/:companyid/salaries/:salaryid', companyCtrl.Delete_Salary);
router.delete('/:companyid/questions', companyCtrl.Delete_AllQuestions);
router.delete('/:companyid/questions/:questionid', companyCtrl.Delete_Question);
router.delete('/:companyid/questions/:questionid/answers', companyCtrl.Delete_AllAnswers);
router.delete('/:companyid/questions/:questionid/:answerid', companyCtrl.Delete_Answer);


module.exports = router;