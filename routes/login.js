const express = require('express');
var router = express.Router();
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
    console.log(req.session)
    var erro = 0;
    res.render('login.ejs', { erro : erro });

})
router.post('/',(req, res, next) =>{

    // loginUser.loginUser(req.body.userName, req.body.userPassword);
    loginUser.loginUser(req.body.userName, req.body.userPassword, function(result){
        
        let nomeUtilizador;
        let passwordUtilizador;
        let imagemUtilizador;
        let idUtilizador;
        
        if(result !== null){ 
            nomeUtilizador = result.name;
            passwordUtilizador = result.password;
            imagemUtilizador = result.image;
            idUtilizador = result._id;
        }

        if(req.body.userName != nomeUtilizador){
          console.log("nome não existe")
          var erro = 1;
          return res.render('login.ejs', { erro : erro });
        }

        bcrypt.compare(req.body.userPassword, passwordUtilizador, function(err, result) {
            if (err) console.log(err);

            console.log("palavra passe certa")
            // req.session.userId = 1;
            req.session.userId = idUtilizador;
            req.session.userName = nomeUtilizador;
            req.session.imagem = imagemUtilizador;
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