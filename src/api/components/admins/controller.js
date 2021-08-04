
const {nanoid} = require('nanoid')
const bcrypt = require('bcrypt')
const config = require('../../../../config/index')
const jwt = require('jsonwebtoken')
const controllerAuth = require('../Auth/index')
const { handleFatalError } = require('../../../utils/responses/customRespon')
const { decodeHeader } = require('../../../authorizations')
const decode = require('jsonwebtoken/decode')
module.exports = function(injectedStore, injectedCache){
    let cache = injectedCache
    let store = injectedStore
    
    if(!store ){
          store = require('../../../store/dummy') 
    }
    if(!cache ){
        cache = require('../../../store/dummy') 
  }
  let table = 'admins'
  let procedence = '[ADMIN CONTROLLER]'
  //singUp:
async function createAdminUser(data){ 
    return new Promise( async (resolve, reject) => {
          if(!data.first_name || !data.last_name || !data.email || !data.encrypted_password){
                  handleFatalError(`${procedence} ===>createUser - Incomplete Field, there are a incompletes dates`, data)
              reject('Incorrect dates, fill all fields!!!')
              return false;
           }
const body = {id:nanoid(),
            first_name:data.first_name,
            last_name:data.last_name,
            phone_number:data.phone_number,
            email:data.email,
            dateBirthday:data.dateBirthday,
            newEncrypted_password:await bcrypt.hash(data.encrypted_password, 5),  
            full_name:`${data.first_name}`+ " " + `${data.last_name}`,
            provider:'gmail'     
           }
    console.log('[datas body createUser]====>', body)
 resolve(store.create(body, table))
  })
}
async function createAdminUserFacebook(data){ 
  return new Promise( async (resolve, reject) => {
          if(!data.first_name || !data.last_name || !data.email || !data.encrypted_password|| !data.provider){
              handleFatalError(`${procedence} ===>createUserFacebook - Incomplete Field, there are a incompletes dates`, data)
              reject('Incorrect dates, fill all fields!')
              return false;
          }
const body = {id:nanoid(),
            first_name:data.first_name,
            last_name:data.last_name,
            facebook_avatar:data.facebook_avatar,
            phone_number:data.phone_number,
            email:data.email,
            dateBirthday:data.dateBirthday,
            newEncrypted_password:await bcrypt.hash(data.encrypted_password, 5),  
            full_name: `${data.first_name} ${data.last_name}`,     
            uid:data.uid, 
            provider:data.provider,
            avatar:data.avatar
        }
     console.log('[datas body createUserFacebook]====>', body)
const  respon = await store.create_UF(body, table)

if(respon){
 resolve(controllerAuth.insertLogin(body, data.encrypted_password))
}

if(respon.routine ==='_bt_check_unique'){
 resolve( controllerAuth.insertLogin(body, data.encrypted_password))
}
 resolve(respon)

  })
}
async function createAdminUserIOS(data){ 
  return new Promise( async (resolve, reject) => {
          if(!data.encrypted_password){
              handleFatalError(`${procedence} ======> createUserIOS - There are a incompletes dates `, data)
              reject('Incorrect dates, fill all fields!')
              return false;
          }
   const body = {   id:nanoid(),
                    first_name:data.first_name,
                    last_name:data.last_name,
                    phone_number:data.phone_number,
                    email:data.email,
                    dateBirthday:data.dateBirthday,
                    newEncrypted_password:await bcrypt.hash(data.encrypted_password, 5),  
                    full_name: `${data.first_name} ${data.last_name}`,     
                    uid:data.uid, 
                    provider:data.provider || 'Apple',
               };
console.log("Body [USER CONTROLLER] CreateUserIos ====> ", body)
if(data.email !== null && data.encrypted_password && body.provider === 'Apple'){
  const  respon = await store.createUIOS(body, table)
  const responAuth = await controllerAuth.upsertAuth(respon, body)
  console.warn(chalk.blue(`${procedence} THIS IS THE RESPON responAuth [createIosUser]--->`), responAuth)
  if(respon){
      resolve(controllerAuth.insertLogin(body, data.encrypted_password))
    }   
   if(respon.routine ==='_bt_check_unique'){
      resolve( controllerAuth.insertLogin(body, data.encrypted_password))
    }
   }
 if(data.email == null && data.encrypted_password  && body.provider === 'Apple'){
      resolve(controllerAuth.insertLogin(body, data.encrypted_password))
 }
  resolve(respon)

  })
}
async function getAdminUser(data){
  return new Promise( async (resolve, reject)=>{
const decoded = await decodeHeader(data)
      if(!data.id){
           handleFatalError(`${procedence} ======> getUser - There are Not Id`)
          reject('don`t bring the id')
          return false;
      } 
  const dataUser = await store.get(data, table)
       resolve(dataUser)
  })

}
async function listAdminUser(){ 
 let users  = await cache.list(table)
    if(!users){
    console.log('no estaba en cachee, buscando en db')
       users = await store.list(table)
         cache.upsert(users, table)
    }else{
       console.log('datos traidos de la cache')
    }
return users
}
async function updateUser(theBody, file){
  return new Promise (async(resolve, reject) =>{
      if(!theBody){
          reject(`${procedence}======> UpdateUser - There Are Not Datas for Update`)
          return false;
      }
   const decoded = await decodeHeader(theBody);    
 let avatarPath = ''
 if(file){
  avatarPath = `https://back.confirmapp.com/app/avatar/` + file.filename 
  }
           const body ={   
               id:decoded.id,           
               avatar:avatarPath, 
               first_name:theBody.data.first_name, 
               last_name:theBody.data.last_name, 
               email:theBody.data.email, 
               language:theBody.data.language,
               encrypted_password:theBody.data.encrypted_password 
           }
             console.log(`${procedence} ======> updateUser - This is the datas updateUser ==>`, theBody)
   resolve(store.update(body, table))
   })
}
async function filterUser(data){ 
  console.log(chalk.blue(data))
  const decoded = await decodeHeader(data);
 
  switch (theBody.type) {
      case 'filter_full_name':
      const users = await store.filter_u(data.filterFullname, table, decoded.id)
      return users
      case 'filter_userId':
      const user = await  store.search_U_ID(data, table)
      return user
      default:
          break;
  }
      
}

const removeUserOrAmin = async(datas) =>{
  return new Promise(async(resolve, reject)=>{
      if(!datas){
        reject('there are not data Query!');
        return false;
      }

   const decoded = await decodeHeader(datas)
      const dataToStore = {
        id:datas.user_id,
        type:datas.user_type
      }
      resolve(store.removeUserOrAdmin(dataToStore))
  })
}

  return  {
      create:createAdminUser,
      create_UF:createAdminUserFacebook,
      create_UIOS:createAdminUserIOS,
      get:getAdminUser,
      list:listAdminUser,
      update:updateUser,
      filter:filterUser,
      remove:removeUserOrAmin
  }
}
