const auth = require('../../../authorizations/index')
module.exports = function cheakAuth(action){
 
 function middleware (req, res, next){
       switch(action){
           case 'update':
                auth.cheak.logged(req)
                next()
              break;
           case 'get':
                auth.cheak.logged(req)
              break;
           case 'list':
                auth.cheak.logged(req)
           case 'filter':
                auth.cheak.logged(req)
           default:
                next();
       } 

   }
   return middleware;

}