const node_mailer =  require("nodemailer");

const sendEmail =  async(options) =>{

 const transporter =  node_mailer.createTransport({
   host: process.env.SMTP_HOST,
   port:  process.env.SMTP_PORT,
   auth:{
    user:process.env.SMTP_EMAIL,
    pass:process.env.SMTP_PASSWORD
   } });

   
   let message  = {
        from:`${process.env.FROM_name} <${process.env.FROM_EMAIL}>`,
        to:options.email,
        subject:options.subject,
        text:options.message
   }

   const info = await transporter.sendMail(message)

   console.log('message sent '.green.inverse , info.messageId)
   
}

module.exports =  sendEmail;