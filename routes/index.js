const express = require('express');
var router = express.Router();

let verificaUtilizadorFezLogin = (req, res, next) =>{
    if(!req.session.userId) {
        // next()
        res.redirect('/login')
    }
    else next()
}

router.get('/', verificaUtilizadorFezLogin, (req, res, next) =>{

    res.render('index.ejs')
   
})

module.exports = router;
