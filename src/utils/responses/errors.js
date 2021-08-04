const response = require('./index');
const chalk = require('chalk')
function errors(err, req, res, next) {
     
    console.error(` [FATAL ERROR] ====> ${chalk.redBright(err)} `);

    const message = err.message || 'Error interno';
    const status = err.statusCode || 500;

    response.error(req, res, message, status);
}
function success (respo, req, res, next) {
     
    console.error(` [RESPON SUCCESS] ====> ${chalk.greenBright(respo)} `);

    const message = respo.message || 'Success Resonse';
    const status  = respo.statusCode || 200;

    response.success(req, res, message, status);
}

module.exports = errors, success;