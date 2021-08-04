const auth = require('../../../authorizations/index')
module.exports = function cheakAuth(action){
 function middleware (req, res, next){
       switch(action){
          case 'getNotifications':
                auth.cheak.logged(req)
                next()
                break;
           case 'SeeAndUpdateNotification':
                 auth.cheak.logged(req)
                default:
                next();
       } 

   }
   return middleware;

}