const express = require('express');
const mongoConfigs = require('./models/mongoConfigs');
const session = require("express-session");

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3000;

app.use(
    session({name: "sessionMilos", secret: "secret", resave: false, saveUninitialized: false})
);

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const indexRouter = require("./routes/index.js");
const indexLogin = require("./routes/login.js");
const indexRegisto = require("./routes/registo");

app.use(express.static('public'));
app.use('/styles', express.static(__dirname + 'public/styles'));

app.set('view-engine', 'ejs');

app.use('/', indexRouter);
app.use('/login', indexLogin);
app.use('/registo', indexRegisto);

io.on('connection', (socket) => {
    console.log('Um utilizador conectou-se ao socket');
    socket.on('disconnect', () => {
        console.log('O utilizador desconectou-se do socket');
    });
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
  });

mongoConfigs.connect(function (err) {
    if (!err) {
        server.listen(port, () => {
            console.log(`listening at port ${port}`);
        })
    } else {
        console.log(err)
    }
})