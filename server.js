const express = require('express')
const mongoConfigs = require('./models/mongoConfigs');
const app = express()
const port = 3000
// var path = require('path');
// const user = require('./models/utilizadores')
const indexRouter = require("./routes/index.js")
const indexLogin = require("./routes/login.js")
const indexRegisto = require("./routes/registo.js")


//isto serve para usar css
app.use(express.static('public'))
app.use('/styles', express.static(__dirname + 'public/styles'))

// app.set('views', path.join(__dirname, 'views'));
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