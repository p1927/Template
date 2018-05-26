var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');