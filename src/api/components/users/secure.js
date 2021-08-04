const auth = require('../../../authorizations/index')
module.exports = function cheakAuth(action){
 
 function middleware (req, res, next){
       switch(action){
           case 'update':
                auth.cheak.logged(req)
                next()
                break;
           case 'get':
                console.log('for getttt', req.headers)
                auth.cheak.logged(req)
                next()
                break;
           case 'list':
                auth.cheak.logged(req)
                next()
                break;
           case 'filter':
                auth.cheak.logged(req)
                next()
           default:
                next();
       } 

   }
   return middleware;

}