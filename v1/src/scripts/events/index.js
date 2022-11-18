const eventEmitter = require("./eventEmitter"); 
const nodemailer = require("nodemailer");



//email yollama işlemi burada olacak.
module.exports =  () => { //* fonk olarak export etmemizin sebebi : app.js'de events();'i kullanmamızdır.
  
    eventEmitter.on("send_mail", async(emailData) => { // eventi kullanıyoruz.(controllers'da) ( eventEmitter'de yeni event olustrduk, baska yapıdaki eventi kullanamıyoruz.)
        // console.log("evetn alındı", data);
        // letli fonkları https://nodemailer.com/about/ 'dan kopyaladık ve değiştirdik.
        
        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
              user: process.env.EMAIL_USER, 
              pass: process.env.EMAIL_PASSWORD, 
            },
          });

          let  info =  await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            ...emailData, //email data'Nın geri kalan bilgisi burdan gelcek. Yanş şöyle: controllers'daki yapıdan belli bilgiler gelecek + buradan da geriye kalan bilgiler gelecek
          });
    });


}