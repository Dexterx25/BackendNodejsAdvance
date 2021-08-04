const {nanoid} = require('nanoid')
const {socket} = require('../../../socket')
const notificationModule = require('../../../MSV_notifications/components/notifications/baseNotification');
const config = require('../../../config')
const error = require('../../../utils/responses/errors')
const jwt = require('jsonwebtoken');
const { create } = require('../../../api/components/users');

module.exports = function(injectedStore, injectedCache){
    let cache = injectedCache
    let store = injectedStore
    
    if(!store ){
          store = require('../../../store/store') 
    }
    if(!cache ){
        cache = require('../../../store/store') 
  }
 // let table = 'message'
let table = "messages"
let tableChannels = "channelchats"
let procedence = '[CONTROLLER CHATS]'

function createChannel (datas){
     const destructingEvent = filesEvent //.rows[0]
    console.log('jeje te estoy pasando este evento:', destructingEvent )
    console.log('este es el nombre', destructingEvent.name)
  //  console.log('te toy pasando este sinboito', parameters)
       return new Promise( async (resolve, reject)=>{
            if(!destructingEvent.name || !destructingEvent.user_id){
                reject('invalid datas or nill')
              return false
            }
              const theId = nanoid()
             const datasChannel={
                 id: theId,
                 user_id:destructingEvent.user_id, 
                 channel_name:destructingEvent.name,

              }
           resolve(store.create_CHANNEL(datasChannel, tableChannels))

       })
}

function addMessage(datas) {
    //const {tokenDestructing} = parameters.token
    return new Promise( async(resolve, reject) => {
         console.log('datas body [cotroller ]', body )
        if (!body.message || !parameters.token ) {
            console.error('[messageController] no hay mensaje qué enviar');
            reject('Los datos son incorrectos');
            return false;
        }
/////////////////////////
function getToken(tok){ 
    if(!tok){
           error('Don`t bring Token', 401)
    }
    if(tok.indexOf("Bearer ") === -1){
        throw error('formato invalido', 401)
    }
    let token = tok.replace("Bearer ", "");
    return token
   }
    const SECRET = config.jwt.secret;
    const decoded = await decodeHeader(parameters);
    //const respon = await  store.getParents(decoded, table)
 
    let fileUrl = '';
    if (file) {
        fileUrl = "http://18.221.124.216:3004/api/chats/files/" + file.filename;
    }
  const createReaded =  await body.members.reduce((acc,obj)=>{
         const objec = {}
               objec['_id'] =   obj.user_id
               objec['name'] =  obj.full_name
               objec['channel_id'] = parameters.channel_id
               objec['channel_name']=  obj.channel_name
               if(obj.user_id !== decoded.id ){
                 //condition on the chat online 
                 objec['readed'] = 0
                   }else{
                 objec['readed'] = 1
                 }
                acc.push(objec)
        
            return acc
         }, [])

         console.warn('THIS IS THE CREATE READED--->', createReaded)
       let idNanoid = nanoid()

       const msgSocket = {user:
        { 
        _id:decoded.id,
        name:decoded.full_name,
        avatar:decoded.avatar,
        },
      _id:idNanoid, 
      channel_id:parameters.channel_id,
      readed:createReaded,
      createdAt:body.createdAt,
       text: body.message}
       console.warn('this is the formateMessage:'. msgSocket)
    socket.io.emit('message', msgSocket);
   const justMyReaded = msgSocket.readed
   console.warn('THIS IS JUST MY READED---->', justMyReaded)
         const newMyReaded = justMyReaded.reduce((acc,subobj)=>{
                const objec = {}
                objec['msg_id'] = msgSocket._id
                objec['text'] = msgSocket.text
                objec['channel_id'] = msgSocket.channel_id
                objec['_id'] = subobj._id
                objec['name'] = subobj.name
                objec['readed'] = subobj.readed
                   acc.push(objec)
                  return acc
                },[])
            console.warn('THIS IS THE NEW READEDE--->', newMyReaded)
        socket.io.emit('msgreaded',  newMyReaded)
   
      console.warn('MESSAGE for Socket-io', newMyReaded)
      const convertReaded = JSON.stringify(createReaded)
    const fullMessage = {
        id: idNanoid,
        dataUser: decoded,
        channel_id: parameters.channel_id,
        message: body.message, 
        readed:convertReaded,
        file: fileUrl,
    };
    
    const responSendMessage =  await store.add_M(fullMessage, table)
    
   
    const sender_id = decoded.id
    await notificationModule.MessageChatBase(responSendMessage.dataCannel, responSendMessage.fullMessage[0], sender_id) 
    
    resolve(responSendMessage.fullMessage);
  
   
    //    return respon
    function verify (token){
    return jwt.verify(token, SECRET)
}
    function decodeHeader(parameters){
    const authorization = parameters.token  || '';
    const token = getToken(authorization) 
    const decoded = verify(token)
    return decoded;
}
////////////////////////

    });
}

async function create(datas){
  
}







async function getAllMessages(data){
    return new Promise( async(resolve, reject) =>{
        
    console.log('este es el channels_id', data)
        if(!data){
           reject('there are not userData')
           return false
       }
       if(data.channels_id == 'undefined'){
          reject('there are not datas channels')
           return false
       }
       function getToken(tok){ 
        if(!tok){
            throw  error('Don`t bring Token', 401)
        }
        if(tok.indexOf("Bearer ") === -1){
            throw error('formato invalido', 401)
        }
        let token = tok.replace("Bearer ", "");
        return token
    }
    const SECRET = config.jwt.secret;
    const decoded = await decodeHeader(data);

   
  // return respon
    function verify (token){
           return jwt.verify(token, SECRET)
         }
   function decodeHeader(data){
       console.log('este es el data---->', data)
       const authorization = data.token || '';
       const token = getToken(authorization) 
       const decoded = verify(token)
    return decoded;
   }
   console.log('este es el decoded--->', decoded)

   const tables={
    table:table,
    table2:tableChannels
}
const dataToStore ={
     dataUser:decoded,
     channels_id:data.channels_id
}
const respon = await  store.getAllMessages(dataToStore, tables)
    resolve(respon)


})
      
}

async function listForChannelList (data){
return new Promise(async(resolve, reject)=>{
    if(!data){
        reject('there are not channelsData')
        return false
    }
    function getToken(tok){ 
        if(!tok){
            throw  error('Don`t bring Token', 401)
        }
        if(tok.indexOf("Bearer ") === -1){
            throw error('formato invalido', 401)
        }
        let token = tok.replace("Bearer ", "");
        return token
    }
    const SECRET = config.jwt.secret;
    const decoded = await decodeHeader(data);

   
  // return respon
    function verify (token){
           return jwt.verify(token, SECRET)
         }
   function decodeHeader(data){
       console.log('este es el data---->', data)
       const authorization = data.token || '';
       const token = getToken(authorization) 
       const decoded = verify(token)
    return decoded;
   }
   console.log('este es el decoded--->', decoded)

   const tables={
    table:table,
    table2:tableChannels
}
const dataToStore ={
     dataUser:decoded,
     channels_id:data.channels_id
}
const respon = await store.listForChannelList(dataToStore, tables)
    resolve(respon)

})
}

async function socketConnection(data){
    function getToken(tok){ 
        if(!tok){
            throw  error('Don`t bring Token', 401)
        }
        if(tok.indexOf("Bearer ") === -1){
            throw error('formato invalido', 401)
        }
        let token = tok.replace("Bearer ", "");
        return token
    }
    const SECRET = config.jwt.secret;
    const decoded = await decodeHeader(data);

   
  // return respon
    function verify (token){
           return jwt.verify(token, SECRET)
         }
   function decodeHeader(data){
       console.log('este es el data---->', data)
       const authorization = data.token || '';
       const token = getToken(authorization) 
       const decoded = verify(token)
    return decoded;
   }
   console.log('este es el decoded--->', decoded)

   const tables={
    table:table,
    table2:tableChannels
}
const dataToStore ={
     dataUser:decoded,
     channels_id:data.channels_id
}
// const respon = await store.listForChannelList(dataToStore, tables)
//     resolve(respon)
}

function listChannels(data) {
    return new Promise(async(resolve, reject) => {
       if(!data){
           reject('there are not channels_id for channels of events')
           return false
       }
       function getToken(tok){ 
        if(!tok){
               error('Don`t bring Token', 401)
        }
        if(tok.indexOf("Bearer ") === -1){
            throw error('formato invalido', 401)
        }
        let token = tok.replace("Bearer ", "");
        return token
       }
       function verify (token){
        return jwt.verify(token, SECRET)
    }
        function decodeHeader(data){
        const authorization = data.token  || '';
        const token = getToken(authorization) 
        const decoded = verify(token)
        return decoded;
    }
        const SECRET = config.jwt.secret;
        const decoded = await decodeHeader(data);
         const channels_id = data.filterChannels.filter(channel => channel !== null)

            const datasForStore ={
                dataUser:decoded,
                channels_id:channels_id
            }
         const tables={
            table:table,
            table2:tableChannels
            }
         console.log('ESTE ES E CHANNELS_id------->', channels_id)
        resolve(store.list_CH(datasForStore, tables));
    
    })
}

function getChannel(parameters) {
    return new Promise( async(resolve, reject) => {
    //    console.log('ID CHANEL FOR FILTER:', parameters)

       if(!parameters){
           reject('there are not a filter by channel_id for channels')
           return false
       }
       function getToken(tok){ 
        if(!tok){
               error('Don`t bring Token', 401)
        }
        if(tok.indexOf("Bearer ") === -1){
            throw error('formato invalido', 401)
        }
        let token = tok.replace("Bearer ", "");
        return token
       }
        const SECRET = config.jwt.secret;
        const decoded = await decodeHeader(parameters);
        //const respon = await  store.getParents(decoded, table)
        
        const tables={
            table:table,
            table2:tableChannels
         }
    
           const dataToStore = {
               dataUser:decoded,
               channel_id:parameters.channel_id
           }
        //  socket.io.join(parameters.channels_id)

           respon = await  store.list_M(dataToStore, tables)
             
           resolve(respon);
    
    
       // socket.io.emit('message', fullMessage);
        //    return respon
        function verify (token){
        return jwt.verify(token, SECRET)
    }
        function decodeHeader(parameters){
        const authorization = parameters.token  || '';
        const token = getToken(authorization) 
        const decoded = verify(token)
        return decoded;
    }
   
    
    })
}

function deleteMessage(parameters) {
    return new Promise( async(resolve, reject) => {
        if (!parameters) {
            reject('invalid datas');
            return false;
        }
///////////
function getToken(tok){ 
    if(!tok){
           error('Don`t bring Token', 401)
    }
    if(tok.indexOf("Bearer ") === -1){
        throw error('formato invalido', 401)
    }
    let token = tok.replace("Bearer ", "");
    return token
   }
    const SECRET = config.jwt.secret;
    const decoded = await decodeHeader(parameters);
    //const respon = await  store.getParents(decoded, table)
 
   
      // let idNanoid = nanoid()
    const dataToStore = {
       
        dataUser: decoded,
        message_id: parameters.id,
       
       
    };
    socket.io.emit('remove', {_id:dataToStore.message_id});

  console.log('ESTE es EL DATTOSTORE--->', dataToStore)
    resolve(store.remove_M(dataToStore, table))


    //socket.io.emit('message', fullMessage);
    //    return respon
    function verify (token){
    return jwt.verify(token, SECRET)
}
    function decodeHeader(parameters){
    const authorization = parameters.token  || '';
    const token = getToken(authorization) 
    const decoded = verify(token)
    return decoded;
}
//////////            

      
    });
}

function removeChat(filterChattoDelete){
    return new Promise( async(resolve, reject )=>{
        if(!filterChattoDelete){
            reject('eventId not exit')
            return false;
        }

    resolve(store.remove_chat(filterChattoDelete, table))
        

    })
}

function removeChannel(filterChannel){
    return new Promise( (resolve, reject) =>{
        console.warn('THERE IS DE DATA TO REMOVE channel-->', filterChannel)
        if(!filterChannel){
            reject('there are not channel filter')
        return false;
        }

        resolve(store.remove_channel(filterChannel, tableChannels))

    })
}


return  {
    upsert:create,
    //addMessage,
    get:getChannel,
    list:listChannels,
    //update:updateMessage,
    remove:remove,
    filter:getAllMessages,
    upsert:update,
    socketConnection,
    //functions automatics dependent to events:
    // createChannel,     
    //removeChat,
   // remove_channel:removeChannel,
   // listForChannelList

}
}