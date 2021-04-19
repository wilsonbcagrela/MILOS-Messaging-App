const express = require('express')
const mongoConfigs = require('./models/mongoConfigs');

const port = 3000
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const indexRouter = require("./routes/index.js")
const indexLogin = require("./routes/login.js")
const indexRegisto = require("./routes/registo")

//isto serve para usar css
app.use(express.static('public'))
app.use('/styles', express.static(__dirname + 'public/styles'))

app.set('view-engine', 'ejs')

app.use('/', indexRouter)
app.use('/login', indexLogin)
app.use('/registo', indexRegisto)


mongoConfigs.connect(function(err){
    if(!err){
        app.listen(port, () => {
            console.log(`listening at port ${port}`)
        })
    }else{
        console.log(err)
    }
})