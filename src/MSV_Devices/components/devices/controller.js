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
  let table = 'devices'
  let procedence = '[DEVICES CONTROLLER]'

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

async function getUser(data){
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
async function listUsers(){ 
   let users  = await cache.list(table)
      if(!users){
      console.log('no estaba en cachee, buscando en db')
         users = await store.list(table)
          cache.update(users, table)
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
        get:getUser,
        list:listUsers,
        update:updateUser,
        filter:filterUser
    }
}
