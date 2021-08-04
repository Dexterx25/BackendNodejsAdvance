const config = require('../../../../config/index')
const OneSignalModule = require('./oneSignal')
const pool = require('../../../store/db')
const moment = require('moment')
const cron = require('node-cron');

const MessageChatBase = (data, fullMessage, sender_userId) =>{
  return new Promise(async(resolve, reject)=>{
    if(!data){
      reject('There are not messageToPush')
      return false;
    }
const table = 'devices'
let ArrayDevices = []

for (let i = 0; i < data.length; i++) {
    const userID = data[i].user_id;
    const responPlayers_id = await (await pool.query(`SELECT ${table}.id as device_id, ${table}.player_id, users.full_name, users.id FROM ${table} INNER JOIN users ON ${table}.user_id = users.id where ${table}.user_id = $1`, [userID])).rows

     ArrayDevices.push(...responPlayers_id)
}
const MyUser = await (await pool.query(`SELECT full_name from users where id = $1`,[sender_userId])).rows[0].full_name

console.log('Array of users_IDs And Players_ids messages,', ArrayDevices)
    const dinamicContentEn = `${MyUser} says: ${fullMessage.message}`
    const dinamicContentEs = `${MyUser} dice: ${fullMessage.message}`
    const headingEn = `chat ${data[0].channel_name}`
    const headingEs = `chat ${data[0].channel_name}`
    var message = {
      "app_id": `${config.OneSignal.app_id}`,
      "include_player_ids": ArrayDevices.filter(e => e.id !== sender_userId).map(e => e.player_id),
      "contents":{"en":`${dinamicContentEn}`, "es":`${dinamicContentEs}`},
      "headings":{"en":headingEn, "es":headingEs},
      "ios_badgeType": "Increase",
      "ios_badgeCount":1
        };
console.warn('MESSAge--->', message)
       resolve(OneSignalModule.sendOneSignal_N(message))
    
  })
}

const NotificationBase = (data, notificationType, sender_userId) =>{
     console.warn('AQUI ESTá El array de notificaciones--->', data, notificationType)
     console.warn('AQUI ESTÄ SU PAYLOAD-->', notificationType)
     console.warn('AQUI SU SERDER USER_ID-->', sender_userId)
    let table = 'devices'
    return new Promise( async(resolve, reject) =>{
         
            if(!data){
                reject('there are not a Datamessage to Send')
                return false;
            }

    let ArrayDevices = []

        for (let i = 0; i < data.length; i++) {
            const userID = data[i].user_id;
            const responPlayers_id = await (await pool.query(`SELECT ${table}.id as device_id, ${table}.player_id, users.full_name FROM ${table} INNER JOIN users ON ${table}.user_id = users.id where ${table}.user_id = $1`, [userID])).rows
        
             ArrayDevices.push(...responPlayers_id)
        }

     //   console.log('Array of users_IDs And Players_ids,', ArrayDevices)

        const messageInvi = data[0].message
        let startEvent
          if(notificationType == 'alert_start_event_24Hours_before'){
              startEvent  = moment(JSON.parse(messageInvi).date_event).format('LT')  
          }
        //   if(notificationType == 'alert_start_event_custom'){
            
        //  const  startEventEs  = moment(JSON.parse(messageInvi).date_event).add(-5, 'hour').format('lll')  
        //   }
        const eventName = JSON.parse(messageInvi).event_name
        let MyUser 
         if(sender_userId == 'ConfirmApp'){
           MyUser = 'ConfirmApp'
         }else{
           MyUser = await (await pool.query(`SELECT full_name from users where id = $1`,[sender_userId])).rows[0].full_name       
         } 

let dinamicContentEn
let dinamicContentEs
let headingEn
let headingEs
let message
        switch (notificationType) {
          case 'events':
             dinamicContentEn = `The user ${MyUser} was invited you to the event ${eventName}`
             headingEn = `Event Invitation`
             dinamicContentEs = `El usuario ${MyUser} te invitó a el evento ${eventName}`
             headingEs = `Invitacion de evento`
             message = {
              "app_id": `${config.OneSignal.app_id}`,
              "include_player_ids": ArrayDevices.map(e => e.player_id),
              "contents":{"en":`${dinamicContentEn}`, "es":`${dinamicContentEs}`},
              "headings":{"en":headingEn, "es":headingEs},
              "ios_badgeType": "Increase",
              "ios_badgeCount":1
                        };
                   console.warn('THIS IS THE MESSAGE---->', message,'type--->', notificationType)
        
               resolve(OneSignalModule.sendOneSignal_N(message))
             break;
          case 'friendship_requests':
             dinamicContentEn = `The user ${MyUser} want be your friend`
             headingEn = `FriendShip invitation`
             dinamicContentEs = `El usuario ${MyUser} quiere ser tu amigo`
             headingEs = `Invitacion de amistad`
             message = {
              "app_id": `${config.OneSignal.app_id}`,
              "include_player_ids": ArrayDevices.map(e => e.player_id),
              "contents":{"en":`${dinamicContentEn}`, "es":`${dinamicContentEs}`},
              "headings":{"en":headingEn, "es":headingEs},
              "ios_badgeType": "Increase",
              "ios_badgeCount":1
                        };
                   console.warn('THIS IS THE MESSAGE---->', message,'type--->', notificationType)
        
               resolve(OneSignalModule.sendOneSignal_N(message))
               break;           
          case 'friendship_requests_remove':
             dinamicContentEn = `The user ${MyUser} was remove you for his friend list`
             headingEn = `FriendShip Invitation`
             dinamicContentEs = `El usuario ${MyUser} te eliminó de su lista de usuarios`
             headingEs = `Invitacion de amistad`
             message = {
              "app_id": `${config.OneSignal.app_id}`,
              "include_player_ids": ArrayDevices.map(e => e.player_id),
              "contents":{"en":`${dinamicContentEn}`, "es":`${dinamicContentEs}`},
              "headings":{"en":headingEn, "es":headingEs},
              "ios_badgeType": "Increase",
              "ios_badgeCount":1
                        };
                   console.warn('THIS IS THE MESSAGE---->', message,'type--->', notificationType)
        
               resolve(OneSignalModule.sendOneSignal_N(message))
               break;
          case 'friendship_requests_accepted':
             dinamicContentEn = `The user ${MyUser} acepted your friendship invitation`,
             headingEn = `FriendShip Invitation`
             dinamicContentEs = `El usuario ${MyUser} aceptó tu invitacion de amistad`
             headingEs = `Invitación de amistad`
             message = {
              "app_id": `${config.OneSignal.app_id}`,
              "include_player_ids": ArrayDevices.map(e => e.player_id),
              "contents":{"en":`${dinamicContentEn}`, "es":`${dinamicContentEs}`},
              "headings":{"en":headingEn, "es":headingEs},
              "ios_badgeType": "Increase",
              "ios_badgeCount":1
                        };
                   console.warn('THIS IS THE MESSAGE---->', message,'type--->', notificationType)
        
               resolve(OneSignalModule.sendOneSignal_N(message))
            break;
          case 'friendship_requests_decline':
             dinamicContentEn = `The user ${MyUser} declined your friendship invitation`,
             headingEn = `FriendShip Invitation`
             dinamicContentEs = `El usuario ${MyUser} rechazó tu invitación de amistad`
             headingEs = `Invitacion de amistad`
             message = {
              "app_id": `${config.OneSignal.app_id}`,
              "include_player_ids": ArrayDevices.map(e => e.player_id),
              "contents":{"en":`${dinamicContentEn}`, "es":`${dinamicContentEs}`},
              "headings":{"en":headingEn, "es":headingEs},
              "ios_badgeType": "Increase",
              "ios_badgeCount":1
                        };
                   console.warn('THIS IS THE MESSAGE---->', message,'type--->', notificationType)
        
               resolve(OneSignalModule.sendOneSignal_N(message))
              break;
          case 'invitations_accept':
           const  dinamicContentEnACE_INVI = `The user ${MyUser} acepted your invitation of the event ${eventName}`
            const headingEnACE_INVI = `Event Invitation`
            const dinamicContentEsACE_INVI = `El usuario ${MyUser} aceptó tu invitacion del evento ${eventName}`
           const  headingEsACE_INVI = `Invitacion de evento`
            const  messageACE_INVI = {
              "app_id": `${config.OneSignal.app_id}`,
              "include_player_ids": ArrayDevices.map(e => e.player_id),
              "contents":{"en":`${dinamicContentEnACE_INVI}`, "es":`${dinamicContentEsACE_INVI}`},
              "headings":{"en":headingEnACE_INVI, "es":headingEsACE_INVI},
              "ios_badgeType": "Increase",
              "ios_badgeCount":1
                        };
                   console.warn('THIS IS THE MESSAGE---->', messageACE_INVI,'type--->', notificationType)
        
               resolve(OneSignalModule.sendOneSignal_N(messageACE_INVI))

            break;
          case 'invitations_reject':
             dinamicContentEn = `The user ${MyUser} rejected your invitation of the event ${eventName}`
             headingEn = `Event Invitation`
             dinamicContentEs = `El usuario ${MyUser} rechazó tu invitacion del evento ${eventName}`
             headingEs = `Invitacion de evento`
             message = {
              "app_id": `${config.OneSignal.app_id}`,
              "include_player_ids": ArrayDevices.map(e => e.player_id),
              "contents":{"en":`${dinamicContentEn}`, "es":`${dinamicContentEs}`},
              "headings":{"en":headingEn, "es":headingEs},
              "ios_badgeType": "Increase",
              "ios_badgeCount":1
                        };
                   console.warn('THIS IS THE MESSAGE---->', message,'type--->', notificationType)
        
               resolve(OneSignalModule.sendOneSignal_N(message))
           break;
          case 'event_remove':
             dinamicContentEn = `The admin user ${MyUser} removed the event ${eventName}`
             headingEn = `Event`
             dinamicContentEs = `El administrador ${MyUser} eliminó el evento ${eventName}`
             headingEs = `Event`
             message = {
              "app_id": `${config.OneSignal.app_id}`,
              "include_player_ids": ArrayDevices.map(e => e.player_id),
              "contents":{"en":`${dinamicContentEn}`, "es":`${dinamicContentEs}`},
              "headings":{"en":headingEn, "es":headingEs},
              "ios_badgeType": "Increase",
              "ios_badgeCount":1
                        };
                   console.warn('THIS IS THE MESSAGE---->', message,'type--->', notificationType)
        
               resolve(OneSignalModule.sendOneSignal_N(message))
             break;
          case 'alert_start_event_24Hours_before':
             dinamicContentEn = `The event ${eventName} comming tomorrow`
             headingEn = 'Alert Tomorrow'
             dinamicContentEs = `El evento ${eventName} iniciará mañana`
             headingEs = 'Alerta de mañana'
             message = {
              "app_id": `${config.OneSignal.app_id}`,
              "include_player_ids": ArrayDevices.map(e => e.player_id),
              "contents":{"en":`${dinamicContentEn}`, "es":`${dinamicContentEs}`},
              "headings":{"en":headingEn, "es":headingEs},
              "ios_badgeType": "Increase",
              "ios_badgeCount":1
                        };
                   console.warn('THIS IS THE MESSAGE---->', message,'type--->', notificationType)
        
               resolve(OneSignalModule.sendOneSignal_N(message))
             break;
          case 'alert_start_event_custom':
            moment.locale('es')
            const  startEventEs  = moment(JSON.parse(messageInvi).date_event).add(-5, 'hour').format('lll')  
            moment.locale('en')
            const  startEventEn  = moment(JSON.parse(messageInvi).date_event).add(-5, 'hour').format('lll')  
            dinamicContentEn = `The event ${eventName} comming ${startEventEn}`
             headingEn = 'Scheduled alert'
             dinamicContentEs = `El evento ${eventName} comenzará ${startEventEs}`
             headingEs = 'Alerta programada'
             message = {
              "app_id": `${config.OneSignal.app_id}`,
              "include_player_ids": ArrayDevices.map(e => e.player_id),
              "contents":{"en":`${dinamicContentEn}`, "es":`${dinamicContentEs}`},
              "headings":{"en":headingEn, "es":headingEs},
              "ios_badgeType": "Increase",
              "ios_badgeCount":1
                        };
                   console.warn('THIS IS THE MESSAGE---->', message,'type--->', notificationType)
        
               resolve(OneSignalModule.sendOneSignal_N(message))
            break;
          case 'alert_start_event_1hour_before':
            dinamicContentEn = `The event ${eventName} comming in less one hour`
            headingEn = 'One hour Alert' 
            dinamicContentEs = `El evento ${eventName} comenzará en menos de una hora`
            headingEs = 'Alerta de una hora'
            message = {
              "app_id": `${config.OneSignal.app_id}`,
              "include_player_ids": ArrayDevices.map(e => e.player_id),
              "contents":{"en":`${dinamicContentEn}`, "es":`${dinamicContentEs}`},
              "headings":{"en":headingEn, "es":headingEs},
              "ios_badgeType": "Increase",
              "ios_badgeCount":1
                        };
                   console.warn('THIS IS THE MESSAGE---->', message,'type--->', notificationType)
        
               resolve(OneSignalModule.sendOneSignal_N(message))
           break;
          case 'alert_start_event_3hour_before':
            dinamicContentEn = `The event ${eventName} comming in less 3 hours`
            headingEn = 'Alert 3 hours'
            dinamicContentEs = `El evento ${eventName} comenzará en menos de 3 horas`
            headingEs = 'Alerta 3 horas'
            message = {
              "app_id": `${config.OneSignal.app_id}`,
              "include_player_ids": ArrayDevices.map(e => e.player_id),
              "contents":{"en":`${dinamicContentEn}`, "es":`${dinamicContentEs}`},
              "headings":{"en":headingEn, "es":headingEs},
              "ios_badgeType": "Increase",
              "ios_badgeCount":1
                        };
                   console.warn('THIS IS THE MESSAGE---->', message,'type--->', notificationType)
        
               resolve(OneSignalModule.sendOneSignal_N(message))
           break;
          case 'alert_start_event_Today':
            dinamicContentEn = `The event ${eventName} comming today`
            headingEn = 'Day event Alet'
            dinamicContentEs = `El evento ${eventName} comenza hoy`
            headingEs = 'Alert dia del evento'
            message = {
              "app_id": `${config.OneSignal.app_id}`,
              "include_player_ids": ArrayDevices.map(e => e.player_id),
              "contents":{"en":`${dinamicContentEn}`, "es":`${dinamicContentEs}`},
              "headings":{"en":headingEn, "es":headingEs},
              "ios_badgeType": "Increase",
              "ios_badgeCount":1
                        };
                   console.warn('THIS IS THE MESSAGE---->', message,'type--->', notificationType)
        
               resolve(OneSignalModule.sendOneSignal_N(message))
             break;
          case 'alert_start_event_Already':
            dinamicContentEn = `The event ${eventName} started!`
            headingEn = 'Event start'
            dinamicContentEs = `El evento ${eventName} ya comenzó`
            headingEs = 'Comienzo de evento'
            message = {
              "app_id": `${config.OneSignal.app_id}`,
              "include_player_ids": ArrayDevices.map(e => e.player_id),
              "contents":{"en":`${dinamicContentEn}`, "es":`${dinamicContentEs}`},
              "headings":{"en":headingEn, "es":headingEs},
              "ios_badgeType": "Increase",
              "ios_badgeCount":1
                        };
                   console.warn('THIS IS THE MESSAGE---->', message,'type--->', notificationType)
        
               resolve(OneSignalModule.sendOneSignal_N(message))
         break;

           default:
                break;
        }
        
    })
     
}
module.exports ={
    NotificationBase, 
    MessageChatBase
}