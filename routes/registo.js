const express = require('express')
const bcrypt = require('bcrypt')
const http = require("http");
const path = require("path");
const fs = require("fs.extra");
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');
const tempFolder = './tmp/'; // folder for temporary files, must exist
const upload = multer({ dest: tempFolder });
const registoUser = require('../models/utilizadores')
const router = express.Router();


if (!fs.existsSync(tempFolder)){
    fs.mkdirSync(tempFolder)
}


router.get('/',(req, res, next) =>{
    res.render('registo.ejs')
})


router.post('/submit', upload.single('UserPicture'), (req, res, next) => {
    try {
        if(req.body.userPassword == req.body.userConfirmedPassword){
            var hashedPassword = bcrypt.hash( req.body.userPassword, 10)
        }else{
            return res.redirect('/registo')
        }
        
        let name = req.body.userName
        let file = req.file.path
        let fileName = req.file.originalname;

        let uuid = uuidv4()
        const uploadsFolder =  './uploads/users/'+uuid+'/'+name+'/'; 

        registoUser.insertUtilizador(name, hashedPassword, uploadsFolder + fileName)

        if (!fs.existsSync(uploadsFolder)){
            fs.mkdirRecursiveSync(uploadsFolder)
        }
        
        fs.move(file, uploadsFolder + fileName, function (err) {

            if (err) {
                console.log(err);
                res.json({success:false, message: err});
                return;
            }

            res.json({success:true, message: 'File uploaded successfully', fileName: fileName});
        });

        // return res.redirect('/login')
    } catch (error) {
        return res.redirect('/registo')
    }
})

module.exports = router;
