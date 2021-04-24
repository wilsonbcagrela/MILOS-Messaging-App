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
    res.render('registo.ejs')
    // console.log(req.session)
})


router.post('/submit', upload.single('UserPicture'), (req, res, next) => {
    try {

        let name = req.body.userName
        let uuid = uuidv4()

        if(req.body.userPassword == req.body.userConfirmedPassword){
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(req.body.userPassword, salt, function(err, hash) {
                    if (!req.file) {
                        registoUser.insertUtilizador(name, hash, null)
                    } else {
                        const uploadsFolder =  'public/uploads/users/'+uuid+'/'+name+'/'; 
                        let fileName = req.file.originalname;
                        let file = req.file.path

                        registoUser.insertUtilizador(name, hash, uploadsFolder + fileName)

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
    } catch (error) {
        return res.redirect('/registo')
    }
})

module.exports = router;
