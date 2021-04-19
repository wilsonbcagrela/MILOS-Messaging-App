const express = require('express')
const bcrypt = require('bcrypt')
var router = express.Router();

router.get('/',(req, res, next) =>{
    
    res.render('registo.ejs')
    
})

router.post('/submit', (req, res, next) =>{
    // try {
    //     const hashedPassword = await bcrypt.hash( req.body.userPassword, 10)
    //     bcrypt.compare(req.body.userConfirmedPassword, hashedPassword)
    //     req.body.userName
    // } catch (error) {
    //     res.redirect('/registo')
    // }
    
})
module.exports = router;