const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const config = require('../config')
const errors = require('../utils/responses/errors')
const notifications = require('./components/notifications/network')

app.use(bodyParser.json())

app.use('/api', notifications);

app.use(errors);

app.listen(config.notificationsService.port, () =>{
    console.log('notificationsService escuchando en el puerto', config.notificationsService.port)
})