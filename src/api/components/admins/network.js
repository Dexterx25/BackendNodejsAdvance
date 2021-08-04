const express = require('express')
const secure = require('./secure.js')
const response = require('../../../utils/responses/index')
const controller = require('./index')
const chalk = require('chalk')
const {handleFatalError, handleSuccessResponse} = require('../../../utils/responses/customRespon')
const multer = require('multer')

let procedence = '[NETWORK ADMINS]'

const router = express.Router()

const storage = multer.diskStorage({
    destination:   'public/avatar',
    filename: function(req, file, cb){
        cb("", Date.now() + "."+ file.originalname )
    }
})

var upload = multer({
    storage: storage,   
    // dest: 'public/avatar',
});

router.post('/register', upsert)
router.post('/register/facebook', upsertFacebook)
router.post('/register/ios', upsertIOS)
router.get('/', secure('get'), get)
router.get('/list',secure('list'), list)
router.put('/update', secure('update'), upload.single('file'),  update)
router.get('/filter', secure('filter'), filter)
router.get('/delete', secure('delete'), remove)
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

async function upsertFacebook(req, res){   
 const data = req.body
  const datas = {
      first_name:data.first_name,
      last_name:data.last_name,
      facebook_avatar:data.facebook_avatar,
      email:data.email,
      encrypted_password:data.authentications.uid,
      provider:data.authentications.provider,
      uid:data.authentications.uid
  }
   console.log(`${procedence} ====> register-facebook datas ====>`, datas)
controller.create_UF(datas) 
.then((fieldsUsers) => {
handleSuccessResponse(`${procedence} ====> registerFacebook respon ===>`, fieldsUsers)
response.success(req, res, fieldsUsers, 201) //
})
.catch((error)=>{
handleFatalError(`${procedence} ===> registerFacebook-error ===>`, error)
esponse.error(req, res, 'Fields Incompleted', 400, error)
})
}

async function upsertIOS(req, res){   
    const data = req.body

    const dataForUser = {
         first_name:data.first_name,
         last_name:data.last_name,
         email:data.email,
         encrypted_password:data.authentications.uid,
         provider:data.authentications.provider,
         uid:data.authentications.uid
     }
     console.log(`${procedence} ====> RegisterIoS - ${chalk.blueBright(dataForUser)}`)

   controller.create_UIOS(dataForUser) 
       
   .then((fieldsUsers) => {
    handleSuccessResponse(`${procedence} ====> registerIOS respon ===>`, fieldsUsers)
   response.success(req, res, fieldsUsers, 201) // 
   })
   
   .catch((error)=>{
    handleFatalError(`${procedence} ===> registerIOS-error ===>`, error)
    console.log("error desde network: ",error)
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
            response.success(req, res, respon, 200)
        })
        .catch((erro) =>{
            handleFatalError(`${procedence} ===> getAllUser-error ===>`, erro)
            response.error(req, res, 'Admins Not Found', 500, erro )
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

async function remove(req, res, next){

    const data = {
        data:req.body, 
        token:req.headers.authentications
    }

    controller.put(data)

    .then((respo)=>{
     handleSuccessResponse(`${procedence} ====> deleteDataAdmin response ====>`, res)
     response.success(req, res, respo, 200)
    })
    .catch((error)=>{
     handleFatalError(`${procedence} ===> deleteDataAdmin error ===>>`, error)
     response.error(req, res, error, 400)
    })
}



module.exports = router