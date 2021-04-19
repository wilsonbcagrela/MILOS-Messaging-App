const express = require('express')
const bcrypt = require('bcrypt')
var fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');


var router = express.Router();

router.get('/',(req, res, next) =>{
    
    res.render('registo.ejs')
    
})

router.post('/submit', (req, res, next) =>{
    try {
        // const hashedPassword = bcrypt.hash( req.body.userPassword, 10)
        // bcrypt.compare(req.body.userConfirmedPassword, hashedPassword)
        let name = req.body.userName;

        const uuid = uuidv4();

        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);

            //Path where image will be uploaded
            fstream = fs.createWriteStream(__dirname + "/users/" + uuid + "/" + name);
            file.pipe(fstream);
            fstream.on('close', function () {    
                console.log("Upload Finished of " + filename);              
                res.redirect('back');           //where to go next
            });
        });

       /* var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);

            //Path where image will be uploaded
            fstream = fs.createWriteStream(__dirname + '/img/' + filename);
            file.pipe(fstream);
            fstream.on('close', function () {    
                console.log("Upload Finished of " + filename);              
                res.redirect('back');           //where to go next
            });
        });*/

        
/*
        fs.readFile(req.files.image.path, function (err, data) {

            var imageName = req.files.image.name
    
            /// If there's an error
            if(!imageName){
    
                console.log("There was an error")
                res.redirect("/");
                res.end();
    
            } else {
    
            var newPath = __dirname + "/users/" + uuid + "/" + name;
    
              /// write file to uploads/fullsize folder
              fs.writeFile(newPath, data, function (err) {
    
                /// let's see it
                res.redirect("/login");
    
              });
            }
        });*/

        // res.redirect('/login')
        
    } catch (error) {
        res.redirect('/registo', error)
    }
})
module.exports = router;
