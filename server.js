const express         = require('express');
const bcrypt          = require('bcrypt');
const mongoConfigs    = require('./models/mongoConfigs');
const mongoose        = require('mongoose')
const session         = require("express-session");
const passport        = require("passport");
const localStrategy   = require("passport-local").Strategy;
const modelUtilizador = require('./models/utilizadores');

const port = 3000;
const app = express();

//melhor criar um ficheiro env para criar uma variavel secret
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session()); // mantem a sessão aberta

passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser(function (id, done){
    modelUtilizador.utilizador.findById(id, function(err, user){
        done(err, user);
    });
});

passport.use(new localStrategy((userName, userPassword, done) => {
    modelUtilizador.utilizador.findOne({ name: userName }, (err, user) => {
        if(err) return done(err);

        if(!user){
            return done(null, false, {message: "O nome que introduziu não existe"});
        }

        bcrypt.compare(userPassword,user.password, (err, res) => {
            if(err) return done(err);
            if(res === false) return done(null, false, {message: "A password que introduziu esta incorreta"});

            return done(null, user);
        });
    });
}));

const indexRouter = require("./routes/index.js");
const indexLogin = require("./routes/login.js");
const indexRegisto = require("./routes/registo");

//isto serve para usar css
app.use(express.static('public'));
app.use('/styles', express.static(__dirname + 'public/styles'));

app.set('view-engine', 'ejs');

app.use('/', indexRouter);
app.use('/login', indexLogin);
app.use('/registo', indexRegisto);


mongoConfigs.connect(function(err){
    if(!err){
        app.listen(port, () => {
            console.log(`listening at port ${port}`);
        })
    }else{
        console.log(err)
    }
})