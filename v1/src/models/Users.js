const Mongoose = require("mongoose");


//mongoose'dan schema oluşturduk.
const UserSchema = new Mongoose.Schema({

    full_name : String,
    password : String,
    email : String,
    profile_image : String,
},
    {timestamps: true, versionKey: false }
);


//*istersek(yapılmalı) burada logger olusturulabilir. logger'In altında user.js açılıp yapılabilir.


//Mongoose'dan model üret, collection'ını user olcak ve bunu UserSchema'dan  gelecek bu.
module.exports = Mongoose.model("user", UserSchema);





