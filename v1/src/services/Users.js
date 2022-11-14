
const User = require("../models/Users");// Models dosyasından user modeli alcaz cunku burada kaydedilecek mongoya


// kayıt işlemi gerçekleştirilecek:   
const insert = (data) => {
    const user = new User(data); 
    return user.save();  
};                           
 
// mongoose'daki findone fonksiyonunu kullandık: https://mongoosejs.com/docs/api.html#model_Model-findOne
// services'da data'ya kaydediyorduk, ondan burada bilgiler var ve buradan logindata bilgisini alıyoruz ve loginUser'a koyuyoruz ve controllers'da kullanıyoruz.
const loginUser = ( loginData ) => {
    return User.findOne(loginData); //* içindekine göre sorgu yaptırtıyor.(loginData: benim gönderdiğim data'dır)
};

const list = () => { // listeye datadaki bilgileri atcaz (find ile bulcaz ve atcaz)
    return User.find({});  
};


module.exports = {
    insert,
    list,
    loginUser,
};