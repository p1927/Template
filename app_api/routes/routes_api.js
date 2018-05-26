var express = require('express');
var router = express.Router();
var companyCtrl = require('../controllers/company_api');
var ctrlAuth = require('../controllers/authentication');

var jwt = require('express-jwt');
var auth = jwt({
	secret: process.env.JWT_SECRET,
	userProperty: 'payload'
});

/* GET company pages. */
router.get('/', companyCtrl.Allcompanies);
router.get('/:companyid', companyCtrl.Singlecompany);
router.get('/:companyid/reviews', companyCtrl.AllReviews);
router.get('/:companyid/:reviewid', companyCtrl.SingleReviews);
router.get('/:companyid/:reviewid/comments', companyCtrl.AllComments);
router.get('/:companyid/:reviewid/:commentid', companyCtrl.SingleComment);


/* POST Company pages. */
router.post('/', companyCtrl.AddLocation);
router.post('/:companyid/review', auth, companyCtrl.AddReview);
router.post('/:companyid/:reviewid/comment', auth, companyCtrl.AddComment);
router.post('/:companyid/:reviewid/:commentid/reply', auth, companyCtrl.AddReply);


/* PUT Company pages. */
router.put('/:companyid', auth, companyCtrl.EditLocation);
router.put('/:companyid/:reviewid', auth, companyCtrl.EditReviews);
router.put('/:companyid/:reviewid/upvotes', companyCtrl.UpdateUpvotes);


/* DELETE Company pages. */
router.delete('/', auth, companyCtrl.Delete_AllLocations);
router.delete('/:companyid', auth, companyCtrl.Delete_SingleLocation);
router.delete('/:companyid/reviews', auth, companyCtrl.Delete_AllReviews);
router.delete('/:companyid/:reviewid', auth, companyCtrl.Delete_SingleReviews);
router.delete('/:companyid/:reviewid/comments', auth, companyCtrl.Delete_AllComments);
router.delete('/:companyid/:reviewid/:commentid', auth, companyCtrl.Delete_SingleComment);


///////////////////////////////////////////////////////////////User Authentication routes
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.get('/userexists',ctrlAuth.userexists);  // register form on focus out check

module.exports = router;