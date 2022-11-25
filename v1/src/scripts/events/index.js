const eventEmitter = require("./eventEmitter"); 

//! e-mail
module.exports = () => { 
    eventEmitter.on("send_mail", (emailData) => { 
        let transporter = nodemailer.createTransport({  //? doc: https://nodemailer.com/about/ 
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, 
            auth: {
              user: process.env.EMAIL_USER, 
              pass: process.env.EMAIL_PASSWORD, 
            },
          });

          let info =  transporter.sendMail({
            from: process.env.EMAIL_FROM,
            ...emailData, 
          });
    });
}