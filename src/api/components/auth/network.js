const express = require('express')
const response = require('../../../utils/responses/index')
const controller = require('./index')
const router = express.Router();
const chalk = require('chalk')
const {handleFatalError, handleSuccessResponse} = require('../../../utils/responses/customRespon')
let procedence = '[NETWORK AUTH]'



router.post('/login', function(req, res){
    controller.insert(req.body.email, req.body.password)
      .then((token)=>{
        if(!token){         
          handleFatalError(`${procedence} ===> login-error`, token)
          response.error(req, res, 'user not authorized or invalid credentials', 403,  'user not authrized' )
        }else{         

          handleSuccessResponse(`${procedence} ====> login ===> `, res)
          response.success(req, res,  token, 201)
        }
        })
       .catch((error)=>{
        response.error(req, res, "INTERNAL ERROR", 500)
      })
})
  
router.post('/forget-password', function(req, res, next){ 
       const dataToController = {
        email:req.body.email
      }
      console.log(`${procedence} =====> forget-password body to Controller ===> `, dataToController)

      controller.forgetPass(dataToController)
      .then((respon) =>{
         handleSuccessResponse(`${procedence} ===> forget-password-error`, respon)
         response.success(req, res, respon, 200)
      })
      .catch((e)=>{
        handleFatalError(e)
        response.error(req, res, 'INTERNAL ERROR', 500)
      })
})

router.post('/recovery-code', function(req, res ){
    const dataToController = {
      code: req.body.recoveryPin,
      email:req.body.email
    }
    console.warn('data RECOVERY-code--->', dataToController)
    controller.compareCode(dataToController)
    .then((respon) =>{
        handleSuccessResponse(`${procedence} =====> recovery-code ==>`, respon)
       response.success(req, res, respon, 200) 
    })
    .catch((error)=>{
      handleFatalError(`${procedence} =====> recovery-code ===> `, error)
      response.error(req, res, 'Incorrect code', 400)
    })
})
  
router.put('/reset-password', function(req, res){
    const dataToStore = {
      code:req.body.recovery_pin,
      password:req.body.password,
      confirmPassword:req.body.password_confirmation,
      email:req.body.email
    }
     console.warn('dataResetPassword',dataToStore)
     controller.reset(dataToStore)
     .then((respon) =>{
       handleSuccessResponse(`${procedence} ====> reset-password ===>`,respon)
       response.success(req, res, respon, 202)
     })
     .catch((error) =>{
        handleSuccessResponse(`${procedence} ======> reset-pasword ====> `, error)
        response.error(req, res, 'interanlError', 500 )
     })
})

router.post('/reset-password', function(req, res){

})

module.exports = router;