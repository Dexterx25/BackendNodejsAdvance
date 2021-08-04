const remote = require('./remote');
const config = require('../../config/');

module.exports = new remote(config.MSV_Postgress.host, config.MSV_Postgress.port);