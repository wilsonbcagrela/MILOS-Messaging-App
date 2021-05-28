const express = require('express')
const bcrypt = require('bcrypt')
const http = require("http")
const path = require("path")
const fs = require("fs.extra")
const multer = require('multer')
const {
    v4: uuidv4
} = require('uuid')
const tempFolder = './tmp/' // folder for temporary files, must exist
const upload = multer({
    dest: tempFolder
})
const registoUser = require('../models/utilizadores')
const router = express.Router()

if (!fs.existsSync(tempFolder)) {
    fs.mkdirSync(tempFolder)
}

let redirectHome = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/')
    } else
        next()
}

router.get('/', redirectHome, (req, res, next) => {
    var erro = 0
    var mostraUSer = 0;
    res.render('registo.ejs', {
        erro: erro,
        mostraUSer: mostraUSer
    })
})

router.post('/', upload.single('UserPicture'), (req, res, next) => {

    let name = req.body.userName
    let uuid = uuidv4()
    const uploadsFolder = 'public/uploads/users/' + uuid + '/' + name + '/'

    if (!fs.existsSync(uploadsFolder)) {
        fs.mkdirRecursiveSync(uploadsFolder)
    }

    if (!req.file) {

        registoUser.insertUtilizador(
            name,
            req.body.userPassword,
            req.body.userConfirmedPassword,
            null,
            function (result) {
                if (result) {
                    return res.redirect("/")
                } else {
                    var erro = 1
                    var mostraUSer = 0;
                    return res.render('registo.ejs', {
                        erro: erro,
                        mostraUSer: mostraUSer
                    })
                }
            }
        )

    } else {
        let fileName = req.file.originalname
        let file = req
            .file
            .path

        registoUser
            .insertUtilizador(
                name,
                req.body.userPassword,
                req.body.userConfirmedPassword,
                uploadsFolder.replace("public","") + fileName,
                function (result) {
                    if (!result) {
                        var mostraUSer = 0;
                        var erro = 1
                        return res.render('registo.ejs', {
                            erro: erro,
                            mostraUSer: mostraUSer
                        })
                    }
                }
            )

        fs.move(file, uploadsFolder + fileName, function (err) {

            if (err) {
                console.log(err)
                res.json({
                    success: false,
                    message: err
                })
                return
            }

            return res.redirect('/login')
        })

    }

})

module.exports = router