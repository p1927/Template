var express = require('express');
var router = express.Router();
var authCtrl = require('../controllers/authentication');
var userCtrl = require('../controllers/user_api');

/* GET User Details pages. */
router.get('/',userCtrl.all_Users);
router.get('/:userid',userCtrl.Single_User);

/* ADD User Details pages. */
router.post('/:userid',userCtrl.Add_Applicant);

/* EDIT User Details pages, upload photos,resumes. */
router.put('/:userid/:task',userCtrl.Edit_Applicant);

/* DELETE User Details pages. */
router.delete('/:userid',userCtrl.Delete_Applicant);




///////////////////////////////////////////////////////////////User Authentication routes
router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.get('/userexists',authCtrl.userexists);  // register form on focus out check

module.exports = router;

