const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 587,
    secure:false,
    auth: {
        user: "harsh@wbtechindia.com",
        pass: "HL@mwbt#23"
    }
    ,
    tls: {
        rejectUnauthorized:false
    },
    debug:true
})


const sendMail = (toMailId,subject,text) => {
   try {
     message = {
         from: "support@wbtechindia.com",
         to: toMailId,
         subject: subject,
         text: text //"Hello User,\nYour otp to reset password : " +  otp.toString()
     }
 
     transporter.sendMail(message).then((emailResponse)=>{
         return {status:true,response:emailResponse}
     }).catch((err)=>{
         return {status:false,message:"Error in sending mail."}
     })

   } catch (error) {
        return {status: false,message: ""}
   }
}


const DB = {
    pagarName : "yuvapagar_yug_masterportal",
    jkName : "Jk_Application",
    masterportal : "MaterPortal_Yug"

};

module.exports={
    sendMail,
    // sendSMS,
    DB,
}