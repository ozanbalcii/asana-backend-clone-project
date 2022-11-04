//burası modelde oluşturulan şeylerin kayıt işlemini gerçekleştirmek ve hata varsa yönlendirme yapmak içindir.
//*services altındakinleri  controllers'da kullanıyoruz.

const Project = require("../models/Projects");// user modeli alcaz cunku burada kaydedilecek mongoya


// kayıt işlemi gerçekleştirilecek:
const insert = (data) => {
    const project = new Project(data); 
    return project.save();  //*save'i return etmezsek, bir hata vb durumunu veya işlem dogru mu yapılıyor bilemeyiz.
};                           // save'i return edersek hataları yakalayabileceğimiz hale gelir
                             // hataları, insert nerde(controllers>project.js) çalışıtırıyorsam creat içinde kontrol edeceğim
                             // hatta catch ile yakalıyoruz hataları

const list = () => {
    return Project.find({});  // boş find({}) yaparsak sonucları donuduruyor, yazarsak buluyor onu ve onu dönüdürüyor.
}


module.exports = {
    insert,
    list,
};