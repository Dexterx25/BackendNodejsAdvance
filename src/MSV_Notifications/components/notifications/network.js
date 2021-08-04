const express = require('express')
const secure = require('../../../')
const response = require('../../../network/response')
const controller = require('./index')
const router = express.Router()

router.get('/notifications', secure('getNotifications'), function(req, res){

    const filterNotification =  {token:req.headers.authorization}
 controller.listNotifications(filterNotification)
 .then( (listNotifications)=>{
        response.success(req, res, listNotifications, 200)
    })
 .catch( (e) =>{
        response.error(req, res, e, 404)
 })

})

router.get('/notifications/:id', (req, res, next)=>{
    const catNotification = req.params.id
 controller.get(catNotification)

 .then( (notification) =>{
        response.success(req, res, notification.rows, 200)
 })

 .catch( (e)=>{
        response.error(req, res, e, 404)
 })

})

router.delete('/notifications/remove/:id', (req, res, next)=>{
    const catNotification = {
           id:req.params.id
       }
 controller.delete(catNotification)
 .then( (respon) =>{
        response.success(req, res, respon, 200 )
 })
 .catch( (e)=>{
        response.error(req, res, e, 400)
 })

})
router.put('/notifications/update/:id',secure('SeeAndUpdateNotification')  , (req, res, next)=>{
    const dataToController = {
       id:req.params.id,
       token: req.headers.authorization,
       readed:req.body.readed
    }

 controller.update(dataToController)
 .then( (respon) =>{
        response.success(req, res, respon, 200 )
 })
 .catch( (e)=>{
        response.error(req, res, e, 400)
 })

})

router.post('/notifications/list/update', (req, res, next)=>{
       console.warn('COME TO THE FRONTEND--->', req.body)
       controller.listUpdate(req.body.listIds)
       .then((respon) =>{
              response.success(req, res, respon, 200 )
       })
       .catch( (e)=>{
              response.error(req, res, e, 400)
       })    
})

module.exports = router;
