const express = require('express');
var router = express.Router();
const passport        = require("passport");
const localStrategy   = require("passport-local").Strategy;
const loginUser = require('../models/utilizadores');
const bcrypt = require('bcrypt');

router.get('/',(req, res, next) =>{

    res.render('login.ejs')
})
router.post('/',(req, res, next) =>{

    // loginUser.loginUser(req.body.userName, req.body.userPassword);
    loginUser.loginUser(req.body.userName, req.body.userPassword, function(result){
        let nomeUtilizador;
        let passwordUtilizador;
        //esta parte esta scuffed
        if(result === null){
            nomeUtilizador = "";
            passwordUtilizador = "";
        }else{
            nomeUtilizador = result.name;
            passwordUtilizador = result.password;
        }

        if(req.body.userName != nomeUtilizador){
          console.log("nome não existe")
          return res.redirect("/login")
        }
        bcrypt.compare(req.body.userPassword, passwordUtilizador, function(err, result) {
            if (err) console.log(err);

            console.log("palavra passe certa")
            return res.redirect("/")
        });
        // console.log(result);
    });
   
})


// router.post('/', passport.authenticate('local',{
//     successRedirect: '/',
//     failureRedirect: '/login?error=true'
// }));
module.exports = router;