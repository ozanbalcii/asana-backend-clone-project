//MODELS DOSYASINDA VERİ TABANINDAKİ OBJELERİN TANIMLARI BULUNACAKTIR.
const Mongoose = require('mongoose');


//mongoose modelini olusturmamız için Schema Modellerimizi olusturuyoruz:
const ProjectSchema = new Mongoose.Schema( // mongoose'a schema oluşturttuk.
{
    name: String,
    // user_id : {
    //     type: Mongoose.Types.ObjectId,
    //     ref : "user"
    // }
    },
    {timestamps: true, versionKey: false} //mongoda görmek istediğimiz ve istemediğimiz şeyleri ayarladık.
);



module.exports = Mongoose.model("project", ProjectSchema);







