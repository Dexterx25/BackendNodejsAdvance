const chalk = require('chalk')
function err(message, code){
let e = new Error(message)
if(code){
    e.statusCode = code
}
return e;
}
function succ(message, code){
let res = new Response(message)
    if(code){
        res.statusCode = code
    }
    return res;
}

function handleFatalError (err) {
    console.log(`${chalk.redBright('[FATAL ERROR]')} ${err}`)
    console.log(err.stack)
  }

function handleSuccessResponse(res){
    console.log(`${chalk.green('[SUCCESS RESPON] ====>')} ${res}`)
  }

module.exports ={ err, succ, handleFatalError, handleSuccessResponse}