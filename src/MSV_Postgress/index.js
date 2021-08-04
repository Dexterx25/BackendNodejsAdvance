const express = require('express');
const bodyParser = require('body-parser');

const config = require('../../config/');
const router = require('./network');

const app = express();

app.use(bodyParser.json());

// RUTAS
app.use('/', router)

app.listen(config.MSV_Postgress.host, () => {
    console.log('Servicio de mysql escuchando en el puerto', config.MSV_Postgress.port);
})