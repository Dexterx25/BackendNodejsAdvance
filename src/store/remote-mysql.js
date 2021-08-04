const remote = require('./remote');
const config = require('../../config/');

module.exports = new remote(config.MSV_Mysql.host, config.MSV_Mysql.port);