const express = require('express');
const bcrypt = require('bcrypt');
const http = require("http");
const path = require("path");
const fs = require("fs.extra");
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');
const tempFolder = './tmp/'; // folder for temporary files, must exist
const upload = multer({ dest: tempFolder });
const registoUser = require('../models/utilizadores');
const router = express.Router();
const saltRounds = 10;

if (!fs.existsSync(tempFolder)){
    fs.mkdirSync(tempFolder)
}

let redirectHome = (req, res, next) =>{
    if(req.session.userId) {
        // next()
        res.redirect('/')
    }
    else next()
}

router.get('/', redirectHome, (req, res, next) =>{
    var erro = 0;
    res.render('registo.ejs', { erro : erro });
    // console.log(req.session)
})


router.post('/', upload.single('UserPicture'), (req, res, next)  => {


        let name = req.body.userName
        let uuid = uuidv4()
        const uploadsFolder =  'public/uploads/users/'+uuid+'/'+name+'/'; 


        if(req.body.userPassword == req.body.userConfirmedPassword){
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(req.body.userPassword, salt, function(err, hash) {
                    if (!req.file) {

                        return registoUser.insertUtilizador(name, hash, null,res)
                        
                    } else {
                        let fileName = req.file.originalname;
                        let file = req.file.path

                        registoUser.insertUtilizador(name, hash, uploadsFolder + fileName, function(result){
                            if(result == null){
                                var erro = 1;
                                return res.render('registo.ejs', { erro : erro });
                            }
                        })

                        fs.move(file, uploadsFolder + fileName, function (err) {

                            if (err) {
                                console.log(err);
                                res.json({success:false, message: err})
                                return;
                            }

                            return res.redirect('/login')
                        });
                    }
                });
            });
        }else{
            return res.redirect('/registo')
        }
        

        if (!fs.existsSync(uploadsFolder)){
            fs.mkdirRecursiveSync(uploadsFolder)
        }
        
        

        // return res.redirect('/login')
    
})

module.exports = router;
