const express = require('express');
var router = express.Router();
const passport        = require("passport");
const localStrategy   = require("passport-local").Strategy;
const loginUser = require('../models/utilizadores');

router.get('/',(req, res, next) =>{

    res.render('login.ejs')
})
// router.post('/',(req, res, next) =>{

//     // loginUser.loginUser(req.body.userName, req.body.userPassword);

   
// })


router.post('/', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login?error=true'
}));
module.exports = router;