const express = require('express')
const bcrypt = require('bcrypt')
var router = express.Router();

router.get('/',(req, res, next) =>{
    
    res.render('registo.ejs')
    
})

router.post('/submit', (req, res, next) =>{
    try {
        const hashedPassword = bcrypt.hash( req.body.userPassword, 10)
        bcrypt.compare(req.body.userConfirmedPassword, hashedPassword)
        res.redirect('/login')
        
    } catch (error) {
        res.redirect('/registo')
    }
})
module.exports = router;
