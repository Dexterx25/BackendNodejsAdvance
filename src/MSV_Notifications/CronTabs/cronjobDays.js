const pool = require('../db')
const moment = require('moment')
const OneSignalModule = require('./components/notifications/oneSignal')
const notificationModule = require('./components/notifications/baseNotification')

const reportNotifyDays = async () =>{
   try{
    const getEvents = await ( await pool.query("SELECT * from events where stage = 'active' ")).rows
     await   getEvents.map( async (e) =>{

        
         const today12Hour = moment().format('YYYY-MM-DD')
          const _24HourLaterEvent = moment(e.start_date).add(24, 'hour').format('YYYY-MM-DD');
         const diference = moment(_24HourLaterEvent).diff(today12Hour, 'hour')
        const now = moment(new Date())
             const end = moment(e.start_date)
             var duration = moment.duration(end.diff(now));
             var hours = duration.asHours();
        //     console.warn('THIS IS THE DIFERENCE--->', e.name, "-->", diference, 'and minutes-->', hours) 

             //Mañana--->
         let arrayUsers = []
            if(hours <=24 && hours > 22){
               const selectInvitations = await (await pool.query(`SELECT user_id from invitations where event_id = $1 and state = $2`, [e.id, 2])).rows
               console.warn('return invitations--->', selectInvitations) 
               console.warn('Select invitation--->', selectInvitations)
               if(selectInvitations.length){
                 arrayUsers.push(...selectInvitations, {user_id:e.user_id})
              }else{
                 arrayUsers.push({user_id:e.user_id})
                    }
                 const arrayNotifiState = await(await pool.query(`SELECT * from notifications where notificable_type = $1 AND reference_id = $2 AND cron_state = $3`, ['alert_start_event_24Hours_before', e.id, true])).rows
                 const arrayNotifiExists = await(await pool.query(`SELECT * from notifications where notificable_type = $1 AND reference_id = $2`, ['alert_start_event_24Hours_before', e.id])).rows
               
               
                 const data0 =  await arrayUsers.map( async function (i) {
                    if(!arrayNotifiState.length && !arrayNotifiExists.length){
                           const dataIdxd =  Math.round(Math.random()*100000+1)
                           const messge = {event_name:e.name, event_id:e.id, date_event:e.start_date}
                           const messgeBaseEvent = JSON.stringify(messge)
                           const responNotify = await (await pool.query(`INSERT INTO notifications(id, user_id, notificable_type, message, notificable_id, reference_id)
                              VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,[dataIdxd, i.user_id, 'alert_start_event_24Hours_before', messgeBaseEvent, dataIdxd, e.id])).rows
                              const responOneSignal = await notificationModule.NotificationBase(responNotify, 'alert_start_event_24Hours_before', 'ConfirmApp')

                       }
                     
                     })
                    
            }
        
        })    
        
     }catch(e){
                console.warn('THERE ARE A ERROR in Notification24Hour-->', e)
   }
}

const reportNotifyToday = async () =>{
   try {
      const getEvents = await ( await pool.query("SELECT * from events where stage = 'active' ")).rows
     await  getEvents.map( async (e) =>{

      
       const today12Hour = moment(new Date()).format('lll')
        const _24HourLaterEvent = moment(e.start_date).add(24, 'hour').format('lll');
     //  const diference = moment(_24HourLaterEvent).diff(today12Hour, 'hour')
      const now = moment(new Date())
           const end = moment(e.start_date)
           var duration = moment.duration(end.diff(now));
           var hours = duration.asHours();
      //     console.warn('THIS IS THE DIFERENCE--->', e.name, "-->", diference, 'and minutes-->', hours) 
           //hoy--->
      const dateConvertToday = moment(today12Hour).add(-5, 'hour').format('l')
   
      let arrayUsers = []
      if( dateConvertToday == moment(e.start_date).format('l') &&  moment(today12Hour).add(-5, 'hour').format('LT') >= '6:00 AM' ){
         console.warn('THIS SI SE EJECUTA con este evento-->', e.name, e.id)
         const selectInvitations = await (await pool.query(`SELECT user_id from invitations where event_id = $1 and state = $2`, [e.id, 2])).rows
                console.warn('return invitations--->', selectInvitations) 
                console.warn('Select invitation--->', selectInvitations)
                if(selectInvitations.length){
                  arrayUsers.push(...selectInvitations, {user_id:e.user_id})
               }else{
                  arrayUsers.push({user_id:e.user_id})
                     }
       
      const arrayNotifiState = await(await pool.query(`SELECT * from notifications where notificable_type = $1 AND reference_id = $2 AND cron_state = $3`, ['alert_start_event_Today', e.id, true])).rows
      const arrayNotifiExists = await(await pool.query(`SELECT * from notifications where notificable_type = $1 AND reference_id = $2`, ['alert_start_event_Today', e.id])).rows

           await   arrayUsers.map(async function (i){
         if(!arrayNotifiState.length && !arrayNotifiExists.length ){
            console.warn('pasa por las dos condiciones-->', e.name, e.id)
                  const dataIdxd =  Math.round(Math.random()*100000+1)
                  const messge = {event_name:e.name, event_id:e.id, date_event:e.start_date}
                  const messgeBaseEvent = JSON.stringify(messge)
                  const responNotify = await (await pool.query(`INSERT INTO notifications(id, user_id, notificable_type, message, notificable_id, reference_id)
                  VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,[dataIdxd, i.user_id, 'alert_start_event_Today', messgeBaseEvent, dataIdxd, e.id])).rows
                  console.warn('TODAY RESPON ____-->', responNotify)
                  const responOneSignal = await notificationModule.NotificationBase(responNotify, 'alert_start_event_Today', 'ConfirmApp')

            }
      })
    }
      })
   } catch (error) {
      console.warn('ERROR TODAY-->', error)
   }
} 

reportNotifyToday()
reportNotifyDays()

