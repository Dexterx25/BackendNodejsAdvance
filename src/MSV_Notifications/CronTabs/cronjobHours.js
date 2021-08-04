const pool = require('../db')
const moment = require('moment')
const OneSignalModule = require('./components/notifications/oneSignal')
const notificationModule = require('./components/notifications/baseNotification')

const reportNotifyHours = async () =>{
     
    try{
       const getEvents = await ( await pool.query("SELECT * from events where stage = 'active' ")).rows
     await      getEvents.map( async (e) =>{
             const now = moment(new Date())
             const end = moment(e.start_date)
             var duration = moment.duration(end.diff(now));
             var hours = duration.asHours();
             //menor igual a una hora--->
            let arrayUsers = []
            let arrayUsers3 = []
               if(hours <= 1 ){
                  const selectInvitations = await (await pool.query(`SELECT user_id from invitations where event_id = $1 and state = $2`, [e.id, 2])).rows
                  console.warn('return invitations--->', selectInvitations) 
                console.warn('Select invitation--->', selectInvitations)
                if(selectInvitations.length){
                  arrayUsers.push(...selectInvitations, {user_id:e.user_id})
               }else{
                  arrayUsers.push({user_id:e.user_id})
                  
               }
                console.warn('arrayusers--->', arrayUsers) 
              
            const arrayNotifiState = await(await pool.query(`SELECT * from notifications where notificable_type = $1 AND reference_id = $2 AND cron_state = $3`, ['alert_start_event_1hour_before', e.id, true])).rows
            const arrayNotifiExists = await(await pool.query(`SELECT * from notifications where notificable_type = $1 AND reference_id = $2`, ['alert_start_event_1hour_before', e.id])).rows

            console.warn('responNotifi-->', arrayNotifiState) 
              arrayUsers.map(async ( i) => {
                 console.warn('ITERATION con i-->', i, 'iteration con i.user_id-->', i.user_id)
                if(!arrayNotifiState.length && !arrayNotifiExists.length){
                        const dataIdxd =  Math.round(Math.random()*100000+1)
                        const messge = {event_name:e.name, event_id:e.id}
                        const messgeBaseEvent = JSON.stringify(messge)
                        const responNotify = await (await pool.query(`INSERT INTO notifications(id, user_id, notificable_type, message, notificable_id, reference_id)
                        VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,[dataIdxd, i.user_id, 'alert_start_event_1hour_before', messgeBaseEvent, dataIdxd, e.id])).rows
                        console.warn('dataResponNotify24Hours-->', responNotify)
                        const responOneSignal = await notificationModule.NotificationBase(responNotify, 'alert_start_event_1hour_before', 'ConfirmApp')
                        console.warn('ESTE ES OneSignalRespon--->', responOneSignal) 
                      }
                  }) 
               }
               // {x<=3;x>2}
              // alert_start_event_3hour_before
               if(hours <= 3 && hours > 2 ){
                const selectInvitations = await (await pool.query(`SELECT user_id from invitations where event_id = $1 and state = $2`, [e.id, 2])).rows
                console.warn('return invitations--->', selectInvitations) 
                console.warn('Select invitation--->', selectInvitations)
                if(selectInvitations.length){
                  arrayUsers.push(...selectInvitations, {user_id:e.user_id})
               }else{
                  arrayUsers.push({user_id:e.user_id})
                     }
               
             console.warn('arrayusers--->', arrayUsers) 
              
            const arrayNotifiState = await(await pool.query(`SELECT * from notifications where notificable_type = $1 AND reference_id = $2 AND cron_state = $3`, ['alert_start_event_3hour_before', e.id, true])).rows
            const arrayNotifiExists = await(await pool.query(`SELECT * from notifications where notificable_type = $1 AND reference_id = $2`, ['alert_start_event_3hour_before', e.id])).rows

            console.warn('responNotifi-->', arrayNotifiState) 
              arrayUsers.map(async ( i) => {
                if(!arrayNotifiState.length && !arrayNotifiExists.length){
                        const dataIdxd =  Math.round(Math.random()*100000+1)
                        const messge = {event_name:e.name, event_id:e.id}
                        const messgeBaseEvent = JSON.stringify(messge)
                        const responNotify = await (await pool.query(`INSERT INTO notifications(id, user_id, notificable_type, message, notificable_id, reference_id)
                        VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,[dataIdxd, i.user_id, 'alert_start_event_3hour_before', messgeBaseEvent, dataIdxd, e.id])).rows
                        console.warn('dataResponNotify24Hours-->', responNotify)

                        const responOneSignal = await notificationModule.NotificationBase(responNotify, 'alert_start_event_3hour_before', 'ConfirmApp')
                        console.warn('ESTE ES OneSignalRespon--->', responOneSignal) 

                 }
              }) 
            }

           })    
           
        }catch(e){
                   console.warn('THERE ARE A ERROR in Notification24Hour-->', e)
      }  
  }

  reportNotifyHours()

