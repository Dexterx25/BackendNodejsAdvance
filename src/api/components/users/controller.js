const {nanoid} = require('nanoid')
const bcrypt = require('bcrypt')
const chalk = require('chalk')
const {handleFatalError, handleSuccessResponse} = require('../../../utils/responses/customRespon')
const controllerAuth = require('../Auth/index')
const {decodeHeader} = require('../../../authorizations/index')
module.exports = function(injectedStore, injectedCache){
    let cache = injectedCache
    let store = injectedStore 
    
    if(!store ){
          store = require('../../../store/dummy') 
    }
    if(!cache ){
        cache = require('../../../store/dummy') 
  }
  let table = 'users'
  let procedence = '[USER CONTROLLER]'

  //singUp:
async function createUser({datas, type}){
      return new Promise( async (resolve, reject) => {
            if(!datas.first_name || !datas.last_name || !datas.email || !datas.password){
                    handleFatalError(`${procedence} ===>createUser - Incomplete Field, there are a incompletes dates`, datas)
                reject('Incorrect dates, fill all fields!!!')
                return false;
             }
const body = {
                data:{first_name:datas.first_name,
                last_name:datas.last_name ? datas.last_name : null,
                phone_number:datas.phone_number ? datas.phone_number : null,
                email:datas.email,
                dateBirthday:datas.dateBirthday ? datas.dateBirthday : null,
                full_name:`${datas.first_name}`+ " " + `${datas.last_name}`,
                provider:'gmail', 
                },
              type:type
             }
  const registerRespon = await store.upsert(table, body)

  const responAuth = await controllerAuth.upsert(registerRespon,{
  encrypted_password:await bcrypt.hash(datas.password, 5),
  id:registerRespon.id,
  email:registerRespon.email 
  })
  console.log(registerRespon, responAuth)

  const {email} = Object.assign(registerRespon, responAuth)
   console.log('email controller Auth-->', email)
   
  const response = await controllerAuth.insert(email, datas.password)

   resolve(response)
    })
}
async function createUserFacebook(data){ 
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
async function createUserIOS(data){ 
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
async function getUser(data){
    return new Promise( async (resolve, reject)=>{
  const decoded = await decodeHeader(data)
        if(!decoded.id){
             handleFatalError(`${procedence} ======> getUser - There are Not Id`)
            reject('don`t bring the id the token!')
            return false;
        } 
          const {filter} = data
          const theData = {type:'getUser', querys:filter}
          console.log('the filter--->', filter)
          let user = await cache.get(filter.id, table)
            if(!user){
                console.log('no estaba en cachee, buscando en db')
                user = await store.get(theData, table)
                cache.upsert(user, table)
            }
         resolve(user)
    })

}
async function listUsers(){ 
   let users  = await cache.list(table)
      if(!users){
      console.log('no estaba en cachee, buscando en db')
         users = await store.list(table)
         console.log('users--->', users)
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
    return  {
        insert:createUser,
        create_UF:createUserFacebook,
        create_UIOS:createUserIOS,
        get:getUser,
        list:listUsers,
        update:updateUser,
        filter:filterUser
    }
}
