const {nanoid} = require('nanoid')
const bcrypt = require('bcrypt')
const auth = require('../../../authorizations')
const chalk = require('chalk')
const CTRnotification = require('../../../MSV_notifications/components/notifications/index')
const {handleSuccessResponse, handleFatalError} = require('../../../utils/responses/customRespon')
module.exports = function(injectedStore){
let store = injectedStore

if(!store){
    store = require('../../../store/store')
}
let table2 = 'authentications_users'
let table = 'users'
let procedence = '[CONTROLLER AUTH]'
async function insertLogin(email, password){
console.log(chalk.redBright('start InsertLogin'), email, password)
 const data = await store.query(table2, {email:email}, new Array(table))

 return   bcrypt.compare(password, data.encrypted_password)

 .then(async areEqual=>{
    if(areEqual === true){
        console.log(chalk.redBright('Password and Encripted password are equeal!'))
          const token = await auth.sign(data)
          console.log(`${procedence} ====> insertLogin - ${chalk.blueBright(data)}`)
          return  {token:token}
        }else{
            handleFatalError(`${procedence} =====> insertLogin ===> Invalid Information`)
         return 'Invalid Password'
         }
      }) 
     .catch((e)=>{
           handleFatalError(`${procedence} =====> insertLogin ===>`, e)
      })
}
//user auth
const upsertAuth = (respon, data) =>{
    console.log('DATAS UPSERT ---->', data)
   const authData = {
          data:{
            user_id:respon.id,
            encrypted_password: data.encrypted_password, 
            email:data.email
          },     
          type:'insert_auth'
      }
      console.log(`${procedence} ====> upsertAuth authData body -> ${chalk.blueBright(data)}`)
      return  store.upsert(table2, authData)
}

const getReset = (data) =>{
    return new Promise( async(resolve, reject) =>{
        if(!data.email){
            handleFatalError(`${procedence} =====> getReset there are not email===>`, data)
            reject('there are not email')
            return false
        }
      const respon = await store.getReset(data)
       resolve(respon)
    })
}

const forgetPass = (data) =>{
return new Promise(async(resolve, reject)=>{
  if(!data.email){
        reject('There are not email here')
        return false;
    }
  const respon = await  store.forgetMyPass(data)
  if(respon === undefined){
    reject('Email there are incorret or not exits')
    return false;
}
if(respon.email == data.email){  
   CTRnotification.resetPasswordMail(respon)
   .then( async(res)=>{
         console.warn('this is the estatus Email--->', res)
      await store.inserCode(res)
    .then((resCode) =>{
        handleSuccessResponse(`${procedence} ===> forgetPass ===>`, resCode)
    })
    .catch((error)=>{
        handleFatalError(`${procedence} =====> forgetPass erro insertCode===>`, error)
      })
   })
   .catch((error) =>{
    handleFatalError(`${procedence} =====> forgetPass ===>`, error)
})
} 
console.warn(`${chalk.blue(respon)}`)
  resolve(respon)

})
}

const compareCode = (data) =>{
    return new Promise(async(resolve, reject) =>{
        if(!data){
            reject('there are not data')
            return false;
        }

        const dataToStore = await store.compareCodes(data)
        if(dataToStore.recovery_pin == data.code){
            handleSuccessResponse(`${procedence} ===> compareCode there is a correct Code, we will restart token ===>`, dataToStore, "equal--->", data.code)            
        }else{
           reject('RECOVERY CODE IS INVALID')
        }
     if(dataToStore.code)
        console.warn('Status compareCodes--->', dataToStore) 
      resolve(dataToStore)

    })
}

const resetPassword = async (data) =>{
    return new Promise(async(resolve, reject) =>{
        if(!data){
            reject('there are not data!')
            return false;
        }
        if(data.password == data.confirmPassword){
            console.warn('se procede a encriptar la password')
            const passwordBcrypt = await bcrypt.hash(data.password, 5)
            const dataToStore = {
                newpassword:passwordBcrypt,
                email:data.email,
                code:data.code
            }
          const respon = await store.resetPassword(dataToStore)
          if(respon.recovery_pin == data.code){
            const token = auth.sign(respon)
            resolve(token)
         }
        }else{
            reject('password and confirmPassWord dont are equals')
            return false;
        }
     
    })
}
return{
    upsert:upsertAuth,
    insert:insertLogin,
    getReset,
    reset:resetPassword,
    forgetPass,
    compareCode
    

}


}