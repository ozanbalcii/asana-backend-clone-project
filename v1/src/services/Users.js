
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

// şifre değiştirmek için, burda yapılmasının sebebi:1. olarak update ediyo yani DB'ye kaydedio, DB'ye kaydetme işlemi burda oluyordu.  2. neden ise: kayıt burada oluyor, email bilgisinden kullanıcıyı bulup şifre değişcez, mail bilgiside services'da çünkü db ye burda kaydediliyor.
const modify = (where, data) => { // objeleri başka fonklarda almak için where. örnk: constrollers/user'da resetPassword'de
    console.log(data);
    // findOneAndUpdate'e mongoose'dan bakılarak kullanıldı.(findOneAndUpdate: bir tane bulup güncelle, yan, şifre değiştir gibi bişi old için kullanılıyo.)
    return User.findOneAndUpdate(where, data, {new: true}); // where, data, {new: true} --> objeyi aldık ve yeni obje olusturup döndürdük.
};


module.exports = {
    insert, 
    list,
    loginUser,
    modify,
};