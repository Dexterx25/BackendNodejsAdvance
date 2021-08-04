const config = require('../../../../config/index')
const jwt = require('jsonwebtoken')
const transporter= require('../../../mailer')
const notificationModule = require('./baseNotification');
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
 let table = 'notifications';

const listNotifications = async (data) =>{
    return new Promise( async(resolve, reject) => {
           if(!data){
               reject('there are not a filter by channel_id for channels')
               return false
           }

            const decoded = await decodeHeader(data);
              
               const dataToStore = {
                   dataUser:decoded,
               }                
               respon = await  store.list_N(dataToStore, table)

               resolve(respon);
        
        })
 
}
   
const getNotification = async (catNotification) =>{
      return new Promise( (resolve, reject)=>{
            if(!catNotification){
                reject('there are not notification_id')
                return false;
            }
        resolve(store.get_N(catNotification, table))
      })
    
}
const sendNotifications = async (dataInvitation, bodyEvent) =>{
      return new Promise(async(resolve, reject) =>{
           if(!dataInvitation){
               reject('there are not dataInvitation to send')
               return false;
           }
           if(bodyEvent.id){
               console.log('there is a event notifications')
               
            const IdsNotify = dataInvitation.map(e => e.invitation_id)               
            const arrayNotify = [] 
              for (let i = 0; i < dataInvitation.length; i++) {
                     const obj = {}
                     obj['friend_id'] = dataInvitation[i].user_id
                     obj['invitation_id'] = dataInvitation[i].invitation_id
                     obj['id'] = IdsNotify[i]
                     arrayNotify.push(obj)
                }


             const dataToStore = {
                    userid_sender:bodyEvent.user_id,
                    event_name: bodyEvent.name,
                    event_id:bodyEvent.id,
                    start_date:bodyEvent.start_date,
                    place:bodyEvent.place,
                    notifyData:arrayNotify
                }
             const respon = await store.send_N(dataToStore, table ,'events')
              const responOneSignal = await notificationModule.NotificationBase(respon, 'events', bodyEvent.user_id)
                  console.warn('Datas for OnesingnalSendNotification', responOneSignal)

                 resolve(respon)

           }else{
               console.log('friendShipInvitation')
                   resolve(store.send_N(data))
           }


      })
}

const deleteNotification = async (catNotification) =>{
      return new Promise( (resolve, reject)=>{
            if(!catNotification){
                reject('there are not notification_id')
                return false;
            }
          resolve(store.remove_N(catNotification, table))
          
      })

}

const updateNotification = async (data) =>{
    return new Promise( async(resolve, reject)=>{
          if(!data){
              reject('there are not notification_id')
              return false;
          }
          if(!data){
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
         const decoded = await decodeHeader(data);
         //const respon = await  store.getParents(decoded, table)
         
         
            const dataToStore = {
                dataUser:decoded,
                id:data.id,
                readed:data.readed
            }                
            console.log('data To Store Notification Update-->', dataToStore)
            respon = await  store.update_N(dataToStore, table)

              console.log('Dato de Resultado--->', respon)
            resolve(respon);
     
         function verify (token){
         return jwt.verify(token, SECRET)
     }
         function decodeHeader(data){
         const authorization = data.token  || '';
         const token = getToken(authorization) 
         const decoded = verify(token)
         return decoded;
     }
    })
}

const sendFriendNotifications = async(data, payload)=>{
      return new Promise(async(resolve, reject)=>{
          if(!data){
              reject('there are not data to store')
              return false;
          }
          //let payload = table
          const respon = await store.send_N(data, table, payload) 
       const myUserId = JSON.parse(respon[0].message).user_id
      const responOneSignal = await notificationModule.NotificationBase(respon, payload, myUserId)
      console.warn('Datas for OnesingnalSendNotification', responOneSignal)
      resolve(respon)

      })
}

const sendFriendNotificationRemove = async(data, payload)=>{
    return new Promise(async(resolve, reject)=>{
        if(!data){
            reject('there are not data to store')
            return false;
        }
        //let payload = table
        const respon = await store.send_N(data, table, payload)
    const responOneSignal = await notificationModule.NotificationBase(respon, payload, bodyEvent.user_id)
    console.warn('Datas for OnesingnalSendNotification', responOneSignal)
    resolve(respon)
  
    })
}

const send_friend_Reject = async(data, payload) =>{
      return new Promise(async(resolve, reject)=>{
          if(!data){
              reject('there are not data')
              return false
          }
          console.warn('this is the data from send_friend_Reject---->', data, payload)
          const respon = await store.send_N(data, table, payload)
          console.warn('respon of reject friendShip_invitation-->', respon)
          const myUserId = JSON.parse(respon[0].message).user_id
          const responOneSignal = await notificationModule.NotificationBase(respon, payload, myUserId)
          console.warn('Datas for OnesingnalSendNotification', responOneSignal)
          resolve(respon)
      })
}

const sendFriendNotificationAccept = async(data, payload)=>{
    return new Promise(async(resolve, reject)=>{
        if(!data){
            reject('there are not data to store')
            return false;
        }
        //let payload = table
      const respon =  await  store.send_N(data, table, payload) 
      const myUserId = JSON.parse(respon[0].message).user_id
      const responOneSignal = await notificationModule.NotificationBase(respon, payload, myUserId)
      console.warn('Datas for OnesingnalSendNotification', responOneSignal)
    resolve(respon)
  
  
  
    })
}

const acceptInvitationEvent = async(data, payload) =>{
    return new Promise(async(resolve, reject)=>{
        if(!data){
            reject('there are not data To Validate')
            return false
        }
     console.warn('datas AcceptInvitationsEvent--->', data, payload, data.dataUser.id)
        const respon = await store.send_N(data, table, payload)
        console.warn('this is the respon for Notification responAccept-->', respon)
        console.warn('THIS IS THE PAYLOAD--->', payload)
        console.warn('this is the user_id', data.dataUser.id)
        
        const responOneSignal = await notificationModule.NotificationBase(respon, 'invitations_accept', data.dataUser.id)
        console.warn('Datas for OnesingnalSendNotification', responOneSignal)
       resolve(respon)
    })
}
const rejectEventInvitation = async(data, payload) =>{
    return new Promise(async(resolve, reject)=>{
        if(!data){
            reject('there are not dataTo Reject')
            return false
        }
        const respon = await store.send_N(data, table, payload)
        const responOneSignal = await notificationModule.NotificationBase(respon, payload, data.dataUser.id)
        console.warn('Datas for OnesingnalSendNotification', responOneSignal)
        resolve(respon)
    })
}
const notifyDeleteEvent = async(data, payload) =>{
    return new Promise(async(resolve, reject)=>{
        if(!data){
            reject('there are not data to notify')
            return false;
        }
        console.warn('se realizó envio de datos para conclusion--->', data, payload)
        const respon = await store.send_N(data, table,  payload)
        console.warn('ESTE ES EL respon Notification--->', respon)
        
        const responOneSignal = await notificationModule.NotificationBase(respon, payload, data.dataUser.id )
        console.warn('Datas for OnesingnalSendNotification', responOneSignal)
        resolve(respon)
    
    })

}

const resetPasswordMail = async(data) =>{
 return new Promise( async(resolve, reject)=>{

  console.warn('data for ResetPASsEEMAIL-->', data)
    const dataRequestMail = {
        emitor: "confirmapphw@gmail.com",
      receptor: data.email, 
       full_name:data.full_name,
       code:Math.round(Math.random()*100000+1),
       subject: "enviado desde ConfirmApp WENJAN S.A.S"
     }
   
   const mailOptions = {
        from:dataRequestMail.emitor,
          to:dataRequestMail.receptor,
     subject:dataRequestMail.subject,
     html:`  
     <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
     <html xmlns="http://www.w3.org/1999/xhtml">
       <head>
         <title>WELCOME</title>
         <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
         <meta http-equiv="X-UA-Compatible" content="IE=edge" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0 " />
         <meta name="format-detection" content="telephone=no" />
         <!--[if !mso]><!-->
         <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
         <!--<![endif]-->
         <style type="text/css">
           body {
           -webkit-text-size-adjust: 100% !important;
           -ms-text-size-adjust: 100% !important;
           -webkit-font-smoothing: antialiased !important;
           }
           img {
           border: 0 !important;
           outline: none !important;
           }
           p {
           Margin: 0px !important;
           Padding: 0px !important;
           }
           table {
           border-collapse: collapse;
           mso-table-lspace: 0px;
           mso-table-rspace: 0px;
           }
           td, a, span {
           border-collapse: collapse;
           mso-line-height-rule: exactly;
           }
           .ExternalClass * {
           line-height: 100%;
           }
           span.MsoHyperlink {
           mso-style-priority:99;
           color:inherit;}
           span.MsoHyperlinkFollowed {
           mso-style-priority:99;
           color:inherit;}
           </style>
           <style media="only screen and (min-width:481px) and (max-width:599px)" type="text/css">
           @media only screen and (min-width:481px) and (max-width:599px) {
           table[class=em_main_table] {
           width: 100% !important;
           }
           table[class=em_wrapper] {
           width: 100% !important;
           }
           td[class=em_hide], br[class=em_hide] {
           display: none !important;
           }
           img[class=em_full_img] {
           width: 100% !important;
           height: auto !important;
           }
           td[class=em_align_cent] {
           text-align: center !important;
           }
           td[class=em_aside]{
           padding-left:10px !important;
           padding-right:10px !important;
           }
           td[class=em_height]{
           height: 20px !important;
           }
           td[class=em_font]{
           font-size:14px !important;	
           }
           td[class=em_align_cent1] {
           text-align: center !important;
           padding-bottom: 10px !important;
           }
           }
           </style>
           <style media="only screen and (max-width:480px)" type="text/css">
           @media only screen and (max-width:480px) {
           table[class=em_main_table] {
           width: 100% !important;
           }
           table[class=em_wrapper] {
           width: 100% !important;
           }
           td[class=em_hide], br[class=em_hide], span[class=em_hide] {
           display: none !important;
           }
           img[class=em_full_img] {
           width: 100% !important;
           height: auto !important;
           }
           td[class=em_align_cent] {
           text-align: center !important;
           }
           td[class=em_align_cent1] {
           text-align: center !important;
           padding-bottom: 10px !important;
           }
           td[class=em_height]{
           height: 20px !important;
           }
           td[class=em_aside]{
           padding-left:10px !important;
           padding-right:10px !important;
           } 
           td[class=em_font]{
           font-size:14px !important;
           line-height:28px !important;
           }
           span[class=em_br]{
           display:block !important;
           }
           }
         </style>
       </head>
       <body style="margin:0px; padding:0px;" bgcolor="#ffffff">
         <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
           <!-- === PRE HEADER SECTION=== -->  
           <tr>
             <td align="center" valign="top"  bgcolor="#30373b">
               <table width="600" cellpadding="0" cellspacing="0" border="0" align="center" class="em_main_table" style="table-layout:fixed;">
                 <tr>
                   <td style="line-height:0px; font-size:0px;" width="600" class="em_hide" bgcolor="#30373b"><img src="images/spacer.gif" height="1"  width="600" style="max-height:1px; min-height:1px; display:block; width:600px; min-width:600px;" border="0" alt="" /></td>
                 </tr>
                 <tr>
                   <td valign="top">
                     <table width="600" cellpadding="0" cellspacing="0" border="0" align="center" class="em_wrapper">
                       <tr>
                         <td height="10" class="em_height" style="font-size:1px; line-height:1px;">&nbsp;</td>
                       </tr>
                       <tr>
                         <td valign="top">
                           <table width="100%" border="0" cellspacing="0" cellpadding="0">
                             <tr>
                               <td valign="top">
                                 <table width="150" border="0" cellspacing="0" cellpadding="0" align="right" class="em_wrapper">
                                   <tr>
                                     <td align="right" class="em_align_cent1" style="font-family:'Open Sans', Arial, sans-serif; font-size:12px; line-height:16px; color:#848789; text-decoration:underline;">
                                       <a href="#" target="_blank" style="text-decoration:underline; color:#848789;">Wenjan S.A.S</a>
                                     </td>
                                   </tr>
                                 </table>
                                 <table width="400" border="0" cellspacing="0" cellpadding="0" align="left" class="em_wrapper">
                                   <tr>
                                     <td align="left" class="em_align_cent" style="font-family:'Open Sans', Arial, sans-serif; font-size:12px; line-height:18px; color:#848789; text-decoration:none;">
                                      ConfirmApp Wenjan S.A.S
                                     </td>
                                   </tr>
                                
                                 </table>
     
                               </td>
                             </tr>
                           
                           </table>
                         </td>
                       </tr>
                       <tr>
                         <td height="10" class="em_height" style="font-size:1px; line-height:1px;">&nbsp;</td>
                       </tr>
                       
                     </table>
                   </td>
                 </tr>
               </table>
             </td>
     
           </tr>
           <tr>
              <td align="center"><a href="#" target="_blank" style="text-decoration:none;"><img src="https://back.confirmapp.com/app/avatar/banner-email-header.png" width="100%" height="80%" style="display:block;font-family: Arial, sans-serif; font-size:15px; line-height:18px; color:#30373b;  font-weight:bold;" border="0" alt="ConfirmApp" /></a></td>
           </tr>
           <!-- === //PRE HEADER SECTION=== -->  
           <!-- === BODY SECTION=== --> 
           <tr>
             <td align="center" valign="top"  bgcolor="#ffffff">
               <table width="600" cellpadding="0" cellspacing="0" border="0" align="center" class="em_main_table" style="table-layout:fixed;">
                 <!-- === LOGO SECTION === -->
                 <tr>
                   <td height="10" class="em_height">&nbsp;</td>
                 </tr>
                 
                 <tr>
                   <td height="5" class="em_height">&nbsp;</td>
                 </tr>
                 <!-- === //LOGO SECTION === -->
                 <!-- === NEVIGATION SECTION === -->
                 <tr>
                   <td height="1" bgcolor="#fed69c" style="font-size:0px; line-height:0px;"><img src="https://www.sendwithus.com/assets/img/emailmonks/images/spacer.gif" width="1" height="1" style="display:block;" border="0" alt="" /></td>
                 </tr>
                 <tr>
                   <td height="14" style="font-size:1px; line-height:1px;">&nbsp;</td>
                 </tr>
                 <tr>
                   <td align="center" style="font-family:'Open Sans', Arial, sans-serif; font-size:15px; line-height:18px; color:#30373b;  font-weight:bold;" class="em_font">
                     <p style="text-decoration:none; color:#30373b;">
                                  Hola, ${dataRequestMail.full_name}, hemos recibido que has olvidado tu contraseña... No te preocupes! Este es tu codigo reinicio de contraseña, colocalo para que puedas crear una nueva: ${dataRequestMail.code}.
                     </p> 
                   </td>
                 </tr>
                 
                 <tr>
                   <td height="14" style="font-size:1px; line-height:1px;">&nbsp;</td>
                 </tr>
                
                 <tr>
                   <td height="1" bgcolor="#fed69c" style="font-size:0px; line-height:0px;"><img src="https://www.sendwithus.com/assets/img/emailmonks/images/spacer.gif" width="1" height="1" style="display:block;" border="0" alt="" /></td>
                 </tr>
                 <!-- === //NEVIGATION SECTION === -->
                 <!-- === IMG WITH TEXT AND COUPEN CODE SECTION === -->
                 <tr>
                   <td valign="top" class="em_aside">
                     <table width="100%" border="0" cellspacing="0" cellpadding="0">
                       <tr>
                         <td height="36" class="em_height">&nbsp;</td>
                       </tr>
                           <section style="display:flex; align-items:center; justify-content:center" width="100%" height="70%">
                             <a href="itunes.apple.com/app/apple-store/id1497388031" width="150%" height="40%">
                               <img src="https://back.confirmapp.com/app/avatar/appstore-icon.png" alt="ConfirmApp IOS" width="100%" height="60%" style="display:block;font-family: Arial, sans-serif; font-size:15px; line-height:18px; color:#30373b;  font-weight:bold;" border="0"  />
                             <a>
                                
                               
                             <a href="http://play.google.com/store/apps/details?id=com.confirmapp" width="150%" height="40%">
                               <img src="https://back.confirmapp.com/app/avatar/playstore-icon.png" alt="ConfirmApp PlayStore" width="100%" height="60%" style="display:block;font-family: Arial, sans-serif; font-size:15px; line-height:18px; color:#30373b;  font-weight:bold;" border="0"  />
                             <a>
                               
                           </section>
                            
                    </table>
           <!-- === //BODY SECTION=== -->
           <!-- === FOOTER SECTION === -->
           <tr>
             <td align="center" valign="top"  bgcolor="#30373b" class="em_aside">
               <table width="600" cellpadding="0" cellspacing="0" border="0" align="center" class="em_main_table" style="table-layout:fixed;">
                 <tr>
                   <td height="35" class="em_height">&nbsp;</td>
                 </tr>
                 <tr>
                   <td valign="top" align="center">
                     <table border="0" cellspacing="0" cellpadding="0" align="center">
                       <tr>
                         <td valign="top"><a href="#" target="_blank" style="text-decoration:none;"><img src="https://www.sendwithus.com/assets/img/emailmonks/images/fb.png" width="26" height="26" style="display:block;font-family: Arial, sans-serif; font-size:10px; line-height:18px; color:#feae39; " border="0" alt="Fb" /></a></td>
                         <td width="7">&nbsp;</td>
                         <td valign="top"><a href="#" target="_blank" style="text-decoration:none;"><img src="https://www.sendwithus.com/assets/img/emailmonks/images/tw.png" width="26" height="26" style="display:block;font-family: Arial, sans-serif; font-size:10px; line-height:18px; color:#feae39; " border="0" alt="Tw" /></a></td>
                         <td width="7">&nbsp;</td>
                         <td valign="top"><a href="#" target="_blank" style="text-decoration:none;"><img src="https://www.sendwithus.com/assets/img/emailmonks/images/pint.png" width="26" height="26" style="display:block;font-family: Arial, sans-serif; font-size:10px; line-height:18px; color:#feae39; " border="0" alt="pint" /></a></td>
                         <td width="7">&nbsp;</td>
                         <td valign="top"><a href="#" target="_blank" style="text-decoration:none;"><img src="https://www.sendwithus.com/assets/img/emailmonks/images/google.png" width="26" height="26" style="display:block;font-family: Arial, sans-serif; font-size:10px; line-height:18px; color:#feae39; " border="0" alt="G+" /></a></td>
                         <td width="7">&nbsp;</td>
                         <td valign="top"><a href="#" target="_blank" style="text-decoration:none;"><img src="https://www.sendwithus.com/assets/img/emailmonks/images/insta.png" width="26" height="26" style="display:block;font-family: Arial, sans-serif; font-size:10px; line-height:18px; color:#feae39; " border="0" alt="Insta" /></a></td>
                         <td width="7">&nbsp;</td>
                         <td valign="top"><a href="#" target="_blank" style="text-decoration:none;"><img src="https://www.sendwithus.com/assets/img/emailmonks/images/yt.png" width="26" height="26" style="display:block;font-family: Arial, sans-serif; font-size:10px; line-height:18px; color:#feae39; " border="0" alt="Yt" /></a></td>
                       </tr>
                     </table>
                   </td>
                 </tr>
                 <tr>
                   <td height="22" class="em_height">&nbsp;</td>
                 </tr>
                 <tr>
                   <td align="center" style="font-family:'Open Sans', Arial, sans-serif; font-size:12px; line-height:18px; color:#848789; text-transform:uppercase;">
                    <span style="text-decoration:underline;"><a href="https://politicas.confirmapp.com/PoliticTratament" target="_blank" style="text-decoration:underline; color:#848789;">PRIVACY STATEMENT</a></span> &nbsp;&nbsp;|&nbsp;&nbsp; <span style="text-decoration:underline;"><a href="https://politicas.confirmapp.com/termsAndCondition" target="_blank" style="text-decoration:underline; color:#848789;">TERMS OF SERVICE</a></span>
                   </td>
                 </tr>
                 <tr>
                   <td height="10" style="font-size:1px; line-height:1px;">&nbsp;</td>
                 </tr>
                 <tr>
                   <td align="center" style="font-family:'Open Sans', Arial, sans-serif; font-size:12px; line-height:18px; color:#848789;text-transform:uppercase;">
                     &copy;2&zwnj;014 ConfirmApp Wenjan S.A.S. All Rights Reserved.
                   </td>
                 </tr>
                 <tr>
                   <td height="10" style="font-size:1px; line-height:1px;">&nbsp;</td>
                 </tr>
                 <tr>
                   
                 </tr>
                 <tr>
                   <td height="35" class="em_height">&nbsp;</td>
                 </tr>
               </table>
             </td>
           </tr>
           <!-- === //FOOTER SECTION === -->
         </table>
         <div style="display:none; white-space:nowrap; font:20px courier; color:#ffffff; background-color:#ffffff;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div>
       </body>
     </html>
     `,
    
   }
    await transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
        // response.error(req, res, error.message, 400)
        reject(error)
                console.warn('Mensaje no enviado correctamente', error)
       }else{
            console.log('Mensaje Enviado Correctament', info)
      const dataRespon = {
          email:dataRequestMail.receptor,
          code:dataRequestMail.code,
          info:info
        }
         resolve(dataRespon)
            //  response.success(req, res, info, 201)
        }
   })
})
}

const updateReadedList = async(data)=>{
  return new Promise(async(resolve, reject)=>{
    if(!data){
      reject('there are not data Bring')
      return false
    } 
    console.warn('datas for update notifications list --->', data)
    const respon = await store.update_L_N_R(data, table)
    resolve(respon)
  })
}

  return  {
      acceptInvitationEvent,
      listNotifications,
      get:getNotification,
      send:sendNotifications,
      send_friend: sendFriendNotifications,
      update:updateNotification,
      listUpdate:updateReadedList,
      delete:deleteNotification,
      send_friend_R:sendFriendNotificationRemove,
      send_friend_Reject,
      rejectEventInvitation,
      notifyDeleteEvent,
      send_friend_A:sendFriendNotificationAccept,
      resetPasswordMail
}


}