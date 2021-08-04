const express = require('express')//importamos el módulo nativo de nodeJs: express 
const secure = require('./secure.js')
const response = require('../../../utils/responses/index')//importamos la response de manera que hacemos lo mismo
const chalk = require('chalk')
const controller = require('./index')//importamos el controlador de este components
const {handleFatalError, handleSuccessResponse} = require('../../../utils/responses/customRespon')

let procedence = '[NETWORK CODES]'

const router = express.Router(); 
//routes===>
router.post('/register', upsert)
router.get('/', secure('get'), get)
router.get('/list',secure('list'), list)
router.put('/update', secure('update'),  update)
router.get('/filter', secure('filter'), filter)

//interNal Functions ===>
async function upsert(req, res){   
    const data = {
        type:req.body.type,
        datas:req.body,
        token:req.headers.authorization
     }
     
    console.log(`${procedence} ====> Register - ${chalk.blueBright(data)}`)
     controller.create(data)         
    .then((respon) => {
          if(respon.routine ==='_bt_check_unique'){
          response.error(req, res, 'User email already exist', 500, 'Security Database, posible same existing user' )
         }else{
          handleSuccessResponse(`${procedence} ===> register - responseRegister ===>`, res)
          response.success(req, res, respon, 201) 
        }
    })
    .catch((error)=>{
        handleFatalError(`${procedence} =====> register ===>`, error)
        response.error(req, res, 'Fields Incompleted', 400, error)
    })

}

async function get(req, res){
    const data = {
      include: req.query.include,
      token:req.headers.authentications
    }
    console.log(`${procedence} ====> GatUserById - ${chalk.blueBright(data)}`)
   
    controller.get(data)
  
    .then((dataUser)=>{
        handleSuccessResponse(`${procedence} ====> GatUserById ===> `, dataUser)
        response.success(req, res, dataUser, 200)
    })
    .catch((error) =>{
        handleFatalError(`${procedence} ===> GetUserById-error ===>`, error)
        response.error(req, res, 'internal Error', error, 500)
    })
}

async function list(req, res){

    const data = {
        type:req.body.type,
        datas:req.body, 
        token:req.headers.authentications
    } 
     console.log(`${procedence} ====> getAllUser - ${chalk.blueBright(data)}`)
         controller.list(data) //esta es la petición del router de obtención "router.get"
        .then((respon) => {
            handleSuccessResponse(`${procedence} ====> getAllUser respon ===>`, respon)
            response.success(req, res, respon.rows, 200)
        })
        .catch(error =>{
            handleFatalError(`${procedence} ===> getAllUser-error ===>`, error)
            response.error(req, res, 'Users Not Found', 500, error )
        })
}

async function update (req, res, next){

    const data = {
        token:req.headers.authorization,
        data:req.body
       }
     console.log(`${procedence} ====> UpdateUSer - ${chalk.blueBright(data)}`)
   
     controller.update(data, req.file)
   
   .then((datasAlter)=>{
     handleSuccessResponse(`${procedence} ====> searchUsers respon ===>`, respon)
     response.success(req, res, datasAlter, 202)
    })
   
   .catch((error)=>{
     handleFatalError(error)
     response.error(req, res, datasAlter, 400)
   })
   
}

async function filter(req, res){

 const data = {
    type:req.body.type,
    filter:req.query,
    token:req.headers.authorization
 }

 console.log(`${procedence} ====> getUser - ${chalk.blueBright(data)}`)

  controller.filter(data)
    .then((respon) => {
      handleSuccessResponse(`${procedence} ====> getUser respon ===>`, respon)
        response.success(req, res, respon.rows, 200)
    })
    .catch(error =>{
        handleFatalError(`${procedence} ===> getUser-error ===>`, error)
        response.error(req, res, 'Users Not Found', 500, error )
    })
}

module.exports = router;
