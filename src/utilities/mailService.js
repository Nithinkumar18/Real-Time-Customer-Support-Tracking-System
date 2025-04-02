const nodemailer = require('nodemailer');
const logger = require('../loggers/logger');
const responseInfo = require('../constants/responseMessages');


const transporter = nodemailer.createTransport({

    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth:{
        user: process.env.USER_KEY,
        pass: process.env.PASS_KEY
    },
    tls:{
        rejectUnauthorized: false
    }
})


async function sendNotification(mailparams){
    const notificationInfo = await transporter.sendMail({
        from: '"RealTimeResolve ❋ " <nithinvooturi93@gmail.com>', 
        to: `${mailparams.reciptent_info}`,
        subject: `Update on  ticket ${mailparams.ticketId}`,
        text: "Hi User",
        html:  `Dear Mr/Mrs ${mailparams.reciptent_name} <br/>
               <p>This mail is regarding updates to your ticket ${mailparams.ticketId} on query <b> ${mailparams.query} </b>. 
               ${mailparams.message} current status: ${mailparams.status}</p>
               <p>We are actively working on your request to ensure timely resolution. Should you have any questions or additional information regarding the ticket, please feel free to contact our customer support team at supportickets@example.com. <br/>
               <br/>
                Thanks<br/>
                ${mailparams.respondedBy}<br/>
                Team-RealTimeResolve ❋` 
    })
  logger.info(`Notification sent to customer successfullly`,notificationInfo.messageId);
}
module.exports = {sendNotification}