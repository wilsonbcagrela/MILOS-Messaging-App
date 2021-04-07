const express = require('express')
const app = express()
const port = 3000

//isto serve para usar css
app.use(express.static('public'))
app.use('/styles', express.static(__dirname + 'public/styles'))

app.set('view-engine', 'ejs')
app.get('/', (req, res) =>{

    res.render('index.ejs')
})

app.listen(port)