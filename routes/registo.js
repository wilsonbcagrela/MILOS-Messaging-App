const express = require('express')
const bcrypt = require('bcrypt')
const http = require("http");
const path = require("path");
const fs = require("fs.extra");
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');
const tempFolder = './tmp/'; // folder for temporary files, must exist
const upload = multer({ dest: tempFolder });

const router = express.Router();


if (!fs.existsSync(tempFolder)){
    fs.mkdirSync(tempFolder)
}


router.get('/',(req, res, next) =>{
    res.render('registo.ejs')
})


router.post('/submit', upload.single('UserPicture'), (req, res, next) => {
    try {
        // const hashedPassword = bcrypt.hash( req.body.userPassword, 10)
        // bcrypt.compare(req.body.userConfirmedPassword, hashedPassword)
        let name = req.body.userName
        let file = req.file.path
        let fileName = req.file.originalname;

        let uuid = uuidv4()
        const uploadsFolder =  './uploads/users/'+uuid+'/'+name+'/'; 

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
        
    } catch (error) {
        res.redirect('/registo', error)
    }
})

module.exports = router;
