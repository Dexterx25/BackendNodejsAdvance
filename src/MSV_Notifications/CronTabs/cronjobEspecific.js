const pool = require('../db')
const moment = require('moment')
const OneSignalModule = require('./components/notifications/oneSignal')
const notificationModule = require('./components/notifications/baseNotification')

  const reportNotifycustom = async () =>{
     try{
         const getEvents = await ( await pool.query("SELECT * from events where stage = 'active' ")).rows
      await       getEvents.map( async (e) =>{
    
            
              const today12Hour = moment().format('YYYY-MM-DD')
               const _24HourLaterEvent = moment(e.start_date).add(24, 'hour').format('YYYY-MM-DD');
              const diference = moment(_24HourLaterEvent).diff(today12Hour, 'hour')
              const now = moment(new Date())
              const end = moment(e.start_date)
              const end2 = moment(e.date_alert)
              var duration = moment.duration(end.diff(now));
              var duration2 = moment.duration(end2.diff(now));

            var minutes = duration.asMinutes()
            var minutesAlert = duration2.asMinutes()
            console.warn("startDate and name", moment(e.start_date).format('LT') + '---'+ e.name , 'MINUTES-->', minutes, "MinutesALERT--->", minutesAlert, "alert-date-->",moment(e.date_alert).format('LT'))
              let arrayUsers = []
              let arrayUsersCustom = []
           
                 //alert custom--->
                 if( minutesAlert < 1 ){
                  const selectInvitations = await (await pool.query(`SELECT user_id from invitations where event_id = $1 and state = $2`, [e.id, 2])).rows
                  console.warn('return invitations--->', selectInvitations) 
                  console.warn('Select invitation--->', selectInvitations)
                  if(selectInvitations.length){
                    arrayUsers.push(...selectInvitations, {user_id:e.user_id})
                 }else{
                    arrayUsers.push({user_id:e.user_id})
                       }
                  
                const arrayNotifiState = await(await pool.query(`SELECT * from notifications where notificable_type = $1 AND reference_id = $2 AND cron_state = $3`, ['alert_start_event_custom', e.id, true])).rows
                const arrayNotifiExists = await(await pool.query(`SELECT * from notifications where notificable_type = $1 AND reference_id = $2`, ['alert_start_event_custom', e.id])).rows
               
                console.warn('responNotifi-->', arrayNotifiState) 
                if(!arrayNotifiState.length && !arrayNotifiExists.length){  
                        arrayUsers.map(async ( i) => {
                              console.warn('ITERATION con i-->', i, 'iteration con i.user_id-->', i.user_id)
                              const dataIdxd =  Math.round(Math.random()*100000+1)
                              const messge = {event_name:e.name, event_id:e.id, date_event:moment(e.start_date).format('lll')}
                              const messgeBaseEvent = JSON.stringify(messge)
                              const responNotify = await (await pool.query(`INSERT INTO notifications(id, user_id, notificable_type, message, notificable_id, reference_id)
                                 VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,[dataIdxd, i.user_id, 'alert_start_event_custom', messgeBaseEvent, dataIdxd, e.id])).rows
                              console.warn('dataResponNotify24Hours-->', responNotify)
                              const responOneSignal = await notificationModule.NotificationBase(responNotify, 'alert_start_event_custom', 'ConfirmApp')
                              console.warn('ESTE ES OneSignalRespon--->', responOneSignal)    
                           })
                     }
 
                 }
                   
             })    
            
          }catch(e){
                     console.warn('THERE ARE A ERROR in Notification24Hour-->', e)
        }
   }
   const reportNotifyToday = async () =>{
      try {
         const getEvents = await ( await pool.query("SELECT * from events where stage = 'active' ")).rows
   await      getEvents.map( async (e) =>{
console.warn('THIS EVENTS ACTIVES-->', e.name, e.id)
        
          const today12Hour = moment().format('YYYY-MM-DD')
           const _24HourLaterEvent = moment(e.start_date).add(24, 'hour').format('YYYY-MM-DD');
          const diference = moment(_24HourLaterEvent).diff(today12Hour, 'hour')
          const now = moment(new Date())
          const end = moment(e.start_date)
          const end2 = moment(e.date_alert)
          var duration = moment.duration(end.diff(now));
          var duration2 = moment.duration(end2.diff(now));

        var minutes = duration.asMinutes()
        var minutesAlert = duration2.asMinutes()
     //   console.warn("startDate and name", moment(e.start_date).format('LT') + '---'+ e.name , 'MINUTES-->', minutes, "MinutesALERT--->", minutesAlert, "alert-date-->",moment(e.date_alert).format('LT'))
          let arrayUsers = []
          let arrayUsersCustom = []
          //Ya empezó alert_start_event_Already
             if( minutes < 1 ){
               const selectInvitations = await (await pool.query(`SELECT user_id from invitations where event_id = $1 and state = $2`, [e.id, 2])).rows
               console.warn('return invitations--->', selectInvitations) 
               console.warn('Select invitation--->', selectInvitations)
               if(selectInvitations.length){
                 arrayUsers.push(...selectInvitations, {user_id:e.user_id})
              }else{
                 arrayUsers.push({user_id:e.user_id})
                    }
              
               const arrayNotifiState = await(await pool.query(`SELECT * from notifications where notificable_type = $1 AND reference_id = $2 AND cron_state = $3`, ['alert_start_event_Already', e.id, true])).rows
               const arrayNotifiExists = await(await pool.query(`SELECT * from notifications where notificable_type = $1 AND reference_id = $2`, ['alert_start_event_Already', e.id])).rows

               console.warn('responNotifi-->', arrayNotifiState) 
              arrayUsers.map(async ( i) => {
                if(!arrayNotifiState.length && !arrayNotifiExists.length){
                        const dataIdxd =  Math.round(Math.random()*100000+1)
                        const messge = {event_name:e.name, event_id:e.id, date_event:e.start_date}
                        const messgeBaseEvent = JSON.stringify(messge)
                        const responNotify = await (await pool.query(`INSERT INTO notifications(id, user_id, notificable_type, message, notificable_id, reference_id)
                        VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,[dataIdxd, i.user_id, 'alert_start_event_Already', messgeBaseEvent, dataIdxd, e.id])).rows
                        console.warn('dataResponNotify24Hours-->', responNotify)
                        const responOneSignal = await notificationModule.NotificationBase(responNotify, 'alert_start_event_Already', 'ConfirmApp')
                        console.warn('ESTE ES OneSignalRespon--->', responOneSignal) 
                 }
              }) 
             }
         })
         
      } catch (error) {
         console.warn('errorReportNotifyToday-->', error)
      }
   }
   reportNotifycustom()
   reportNotifyToday()
