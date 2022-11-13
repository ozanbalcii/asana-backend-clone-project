//MODELS DOSYASINDA VERİ TABANINDAKİ OBJELERİN TANIMLARI BULUNACAKTIR.

const Mongoose = require('mongoose');
const logger = require("../scripts/logger/Projects"); // log basma işlemini burda yapcaz, ondan ekledik.


//mongoose modelini olusturmamız için Schema Modellerimizi olusturuyoruz:
const ProjectSchema = new Mongoose.Schema( // mongoose'a schema oluşturttuk.
{
    name: String,
    user_id : {
        type: Mongoose.Types.ObjectId,
        ref : "user",
    },
    },
    { timestamps: true, versionKey: false } //mongoda görmek istediğimiz ve istemediğimiz şeyleri ayarladık.
);



//* schema burda oldugu için hook'u burada yazdık. ve bu dokumana gore yazdık: https://mongoosejs.com/docs/middleware.html#defining
// hook yardımı ile loglama yapacağız.
ProjectSchema.post("save" ,(doc)=>{      //"save" işlemi sonrasında loglama yapacağız.
    logger.log({   // winston ile logger'ı bastırıyoruz.(logs diye dosya oluşturttuk winstona orada bastırdık.)
        level :"info",
        message : doc,
    });
});



module.exports = Mongoose.model("project", ProjectSchema);







