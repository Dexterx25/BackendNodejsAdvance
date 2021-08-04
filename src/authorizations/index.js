const config = require('../../config/index')
const {err} = require('../utils/responses/customRespon')
const jwt = require('jsonwebtoken');
const decode = require('jsonwebtoken/decode');

const SECRET = config.jwt.secret;
 function sign(data){
 return   jwt.sign(data, SECRET)
}

function verify (token){
  return jwt.verify(token, SECRET)
}

const cheak = {
    own: function(req, owner){
     const decoded = decodeHeader(req);

    //VERIFY IF IS OWNER:
    if (decoded.id !== owner) {
        throw err('You can`t do this', 401)
       // throw new Error('No puedes hacer esto');
    }
 },
//  token: function(req, owner){
//     const decoded = decodeHeader(req);
//    console.log("veryfy decoded token:",  decoded)

// },
    logged: function(req, owner){
        const decoded = decodeHeader(req);
            console.log('decoded--->', decoded)
    }
}

function getToken(auth){ 
    if(!auth){
        throw  err('Don`t bring Token', 401)

        //throw new Error('Don`t bring Token', 401)
    }
    if(auth.indexOf("Bearer ") === -1){
        throw err('formato invalido', 401)
       // throw new Error('formato invalido', 401);
    }

    let token = auth.replace("Bearer ", "");

    return token

}

function decodeHeader(req){
    const {headers, token} = req
    const authorization = !headers ? token : headers.authorization || '';
    const thetoken = getToken(authorization)
    const decoded = verify(thetoken)

    req.user = decoded

 return decoded;
}
 
module.exports = {
    sign, 
    cheak,
    decodeHeader
}