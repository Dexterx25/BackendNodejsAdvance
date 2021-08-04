const express = require('express');
const multer = require('multer');

const response = require('../../../network/response');
const controller = require('./index')//importamos el controlador de este components
const router = express.Router();
const secure = require('./secure')
const mimeTypes = require('mime-types');
const { handleSuccessResponse, handleFatalError } = require('../../../utils/responses/customRespon');

const storage = multer.diskStorage({
    destination:   'public/filemessage',
    filename: function(req, file, cb){
        cb("", Date.now() + "."+ file.originalname )
    }
})
var upload = multer({
    storage: storage,   
    // dest: 'public/avatar',
});
let procedence = '[NETWORK - CHAT]'

router.post('/', secure('sendMessage'), upload.single('file'), upsert)
router.get('/:channel_id', secure('getChat'), get)
router.get('/', secure('list'), list)
router.put('/update', secure('update'), upload.single('file'),  update)
router.get('/', secure('filter'), filter)
router.delete('/', secure('delete'), remove)

//send message to chat
async function upsert (req, res) { 
    const datas = {
        type:req.query.type,
        token: req.headers.authorization,
        channel_id:req.params.channel_id,
        data:req.body,
        file:req.file
    }
    controller.upsert(datas)
            .then((respon) => {
                handleSuccessResponse(`${procedence} ===> upsert ==>`, respon)
                response.success(req, res, respon, 201);    
            })
            .catch(e => {
                handleFatalError(`${procedence} ===> upsert ===> `, e)
                response.error(req, res, 'Informacion invalida', 400, 'Error en el controlaor');
            });
}

// Get chat ---> list messages chat
async function get (req, res, next){
    const datasToController = {
        channel_id:req.params.channel_id,
        token:req.headers.authorization
    }
   
     controller.get(datasToController)
     .then( (messages)=>{
         response.success(req, res, messages, 200)
     })
     .catch( (e)=>{
         response.error(req, res, "Unexpected Error", 500, e)
     })
}

//list  user chats
async function list (req, res) {
        const data = {
        type:req.query,
        filterChannels:req.body.channels_id,
        token:req.headers.authorization
        }
       controller.list(data)
            .then((respon) => {
                response.success(req, res, respon, 200);
            })
            .catch(e => {
                response.error(req, res, e, 500);
            })
}

//remove message - chat - chats
async function remove(req, res) {
    const filterMessToDelete = {
        token:req.headers.authorization,
        datas:req.body,
        id:req.params.id
       }
    controller.remove(filterMessToDelete)
        .then((respon) => {
            response.success(req, res, `message succefull deleted`, 203);
        })
        .catch(e => {
            response.error(req, res, 'Informacion invalida', 400, 'Error en el controlaor');
        });
}

//filter - allMessagesUser -
async function filter(req, res) {   
 const datas = {
         type: req.query,
         datas: req.body,
         token: req.headers.authorization
        }

    controller.filter(datas)
       .then((respon) =>{
           handleSuccessResponse(`${procedence} ===> filter ${datas.type} ==> `, res)
           response.success(req, res, respon, 200)
       })
       .catch((error)=>{
           handleFatalError(`${procedence} ==> filter ${datas.type} ==>`, error)
           response.error(req, res, error, 400)
       })
}

//update 
async function update(req, res) {   
    const datas = {
            type: req.query,
            token: req.headers.authorization
           }
   
       controller.update(datas)
          .then((respon) =>{
              handleSuccessResponse(`${procedence} ===> update ${datas.type} ==> `, res)
              response.success(req, res, respon, 200)
          })
          .catch((error)=>{
              handleFatalError(`${procedence} ==> update ${datas.type} ==>`, error)
              response.error(req, res, error, 400)
          })
}

router.get('/socket',secure('connectionSocket'), function(req, res){
    const  dataClient ={
        token:req.headers.authorization,
    }
    controller.socketConnection(dataClient)
    .then((respon)=>{
        handleSuccessResponse(respon)
      response.success(req, res, respon, 200)
    })
    .catch((e)=>{
        handleFatalError(e)
        response.error(req, res, e, 400, e)
    })
   
})

// router.post('/allmessages', function(req, res, next){
//           const datasToController = {
//              channels_id:req.body.channels_id,
//              token:req.headers.authorization
//             }
//             console.log('this is the dataTOcontroller-->', datasToController)
//           controller.getAllMessages(datasToController)
//           .then((respon) => {
//               response.success(req, res, respon,200);
//           })
//           .catch(e => {
//             response.error(req, res, 'Informacion invalidaaaa', 400, 'Error en el controlaor');
//         });
// })
  

module.exports = router;