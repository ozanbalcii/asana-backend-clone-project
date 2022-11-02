//*BU DOSYADA MONGOOSE İLE MONGO DB'YE BAĞLANACAĞIZ.

const Mongoose = require('mongoose');

const db = Mongoose.connection; //connection'ı aldık.


db.once("open", ( ) => { //db bağlantısı gerçekleşirse:
    console.log("DB Connection is currently successful.");    
});

const connectDB = async  ( ) => {
    //burası bizim belirediğimiz yola bağlantı sağlar. Bu bağlantı ile db connection'a sahip olur.
    // burada beklemesini istediğim ve alt satıra gitmemesini istediğim için await koydum.
await Mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,{ 
    useNewUrlParser : true,  //bu iki kodun anlamına bak, bunlara bakın dedi.
    useUnifiedTopology : true,
});
};


module.exports =  {
    connectDB
}