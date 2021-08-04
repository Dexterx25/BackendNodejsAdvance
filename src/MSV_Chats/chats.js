const express = require('express');
const app = express()
let server  = require('http').Server(app)
const bodyParser = require('body-parser');

app.use(bodyParser.json())

const socket = require('../socket')

socket.connect(server)

app.use(bodyParser.urlencoded({extended:false}));
const config = require('../config')
const chats = require('./components/chats/network')
const errors = require('../network/errors');
app.use('/api/chats', chats);
app.use('/api/chats/app', express.static('public'))
app.use(errors)


server.listen(config.chatsServices.port, () =>{
    console.log('chatsServices escuchando en el puerto', config.chatsServices.port)
})
