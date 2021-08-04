
const auth = require('../Auth')
const {nanoid} = require('nanoid')
const { handleFatalError } = require('../../../utils/responses/customRespon')
const { decodeHeader } = require('../../../authorizations')
module.exports = function(injectedStore, injectedCache){
    let cache = injectedCache
    let store = injectedStore
    
    if(!store ){
          store = require('../../../store/store') 
    }
    if(!cache ){
        cache = require('../../../store/store') 
  }

async function generateCode(data){
    return new Promise(async(resolve, reject)=>{
     
      const decoded = await decodeHeader(data)
          if(!decoded){
              reject('You can`t do this!')
              return false
          }

          if(data.countCode > 100){
              reject('You can generate 100 max, try with 100 or less')
              return false;
          }

         if(decoded.adminType !== 'PlatFormAdmin'){
            reject('You are not a admin for this Platform')
            return false;
          }
    let codesGenerateds = []

          for (let i = 0; i < data.countCode; i++) {
            codesGenerateds.push({id:nanoid()})
          }

      resolve(store.generateCode(codesGenerateds))
    
    })
}

async function getCode(data){
//     return new Promise( async (resolve, reject)=>{
//   const decoded = await decodeHeader(data)
//         if(!data.id){
//              handleFatalError(`${procedence} ======> getUser - There are Not Id`)
//             reject('don`t bring the id')
//             return false;
//         } 
//     const dataUser = await store.get(data, table)
//          resolve(dataUser)
//     }) 
}

async function listCode(){ 
   let codes  = await cache.list(table)
      if(!codes){
      console.log('no estaba en cachee, buscando en db')
         codes = await store.list(table)
          cache.update(codes, table)
      }else{
         console.log('datos traidos de la cache')
      }
  return codes
}

async function updateCode(theBody, file){
 
}

async function filterCode(data){ 
}

const removeCode = async(datas) =>{
    return new Promise(async(resolve, reject)=>{
        if(!datas){
          reject('there are not data Query!');
          return false;
        }
  
     const decoded = await decodeHeader(datas)
        const dataToStore = {
          code:datas.codes
        }
        resolve(store.removeCode(dataToStore))
    })
}

return {
    create:generateCode,
    get:getCode,
    list:listCode,
    update:updateCode,
    filter:filterCode,
    remove:removeCode
}


}


