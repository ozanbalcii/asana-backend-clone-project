//bu dosyayı olusturmamızın sebebi: config dosyası altında server(sadece server config işlemleri var)
// dosyası olusturmustum.
// server dosyasında olusturdugumuz config'i gidip app.js(genel olan) require edersek
// olur ama sıkıntısı şu olur, sadece server ile ilgili configirasion işlemimiz olmayabilir.
// örneğin database ile de olabilir. Fakat bizim MVP mimrasine göre temiz kod yazacaksak
// configi çalıştırdıgımda hepsi çalışsın istiyorsam genel bir index.js dosyası yaparım
// ve config altında hangi bölümün configi yapılacaksa mesela server için yaptık ismini server.js yaptık
// bu sebepten dolayı genel hepsini çalıştıracak bir index.js olusturduk ve config'i çalıştırınca config 
// dosyası olan hepsi çalışacak. --> bunu için app.js(genel)'de const config = require("./config");
// yapacağız ve config(); yazarsak tüm configler çalışır.
// diğer dosyalarda da bu mantık olacaktır.

const server = require('./server');


module.exports = () => {
    server();
};