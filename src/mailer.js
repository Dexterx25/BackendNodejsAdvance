const config = require('../config/index');
const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    service:'gmail',
    host:config.EmailService.NewUserInvitation.host,
     port:config.EmailService.NewUserInvitation.port,
     secure:config.EmailService.NewUserInvitation.secure,  
     auth:{
      user:config.EmailService.NewUserInvitation.auth.user,
      pass:config.EmailService.NewUserInvitation.auth.password
     } 
 });

 transporter.verify()
 .then(()=>{
     console.log('Mailer is succefull enable')
 })
 module.exports = transporter
