const express = require('express')
const mongoConfigs = require('./models/mongoConfigs');
const app = express()
const port = 3000

//isto serve para usar css
app.use(express.static('public'))
app.use('/styles', express.static(__dirname + 'public/styles'))

app.set('view-engine', 'ejs')
app.get('/', (req, res) =>{

    res.render('index.ejs')
})

app.get('/login',(req, res) =>{

    res.render('login.ejs')
})

app.get('/registo',(req, res) =>{

    res.render('registo.ejs')
})

mongoConfigs.connect(function(err){
    if(!err){
        app.listen(port, () => {
            console.log(`listening at port ${port}`)
        })
    }else{
        console.log(err)
    }
})