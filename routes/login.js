const express = require('express');
var router = express.Router();
const passport        = require("passport");
const localStrategy   = require("passport-local").Strategy;
const loginUser = require('../models/utilizadores');
const bcrypt = require('bcrypt');

let redirectHome = (req, res, next) =>{
    if(req.session.userId) {
        // next()
        res.redirect('/')
    }
    else next()
}

router.get('/', redirectHome, (req, res, next) =>{
    // req.session.userId = 1;
    // console.log(req.session)
    res.render('login.ejs')

})
router.post('/',(req, res, next) =>{

    // loginUser.loginUser(req.body.userName, req.body.userPassword);
    loginUser.loginUser(req.body.userName, req.body.userPassword, function(result){
        let nomeUtilizador;
        let passwordUtilizador;
        //esta parte esta scuffed
        if(result === null){ //se o user não existir, o nome e a senha ficam vazios, e como não pode existir nomes vazios, não da erro
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
            req.session.userId = 1;
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