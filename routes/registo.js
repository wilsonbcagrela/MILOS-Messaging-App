const express = require('express');
var router = express.Router();

router.get('/',(req, res, next) =>{

    res.render('registo.ejs')
    
})

module.exports = router;