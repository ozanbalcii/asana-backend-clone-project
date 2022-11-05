const Mongoose = require('mongoose');
const logger = require("../scripts/logger/Projects"); // log basma işlemini burda yapcaz, ondan ekledik.


const ProjectSchema = new Mongoose.Schema( 
{
    name: String,
    // user_id : {
    //     type: Mongoose.Types.ObjectId,
    //     ref : "user"
    // }
    },
    {timestamps: true, versionKey: false}
);

//* schema burda oldugu için hook'u burada yazdık. ve bu dokumana gore yazdık: https://mongoosejs.com/docs/middleware.html#defining
ProjectSchema.post("save" ,(doc)=>{      //kayıt sonrasında hook yardımı ile loglama yapıldı.
    logger.log({   // winston ile logger'ı bastırıyoruz.(logs diye dosya oluşturttuk winstona orada bastırdık.)
        level :"info",
        message : doc,
    });
});


module.exports = Mongoose.model("project", ProjectSchema);
