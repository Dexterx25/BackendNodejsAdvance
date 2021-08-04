const { Pool } = require('pg') 
//const mysql = require('mysql');
const {handleFatalError, handleSuccessResponse} = require('../utils/responses/customRespon')
const config = require('../../config/index');


const pool =  new Pool(config.DBconfigPSQL);

const connection = 'xd'

module.exports =
         { pool,
           connection
         }
