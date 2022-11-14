//create, update gibi işlemler için genel olarak validataion işlemleri burada gerçekleştirilecektir.

const Joi = require ("joi"); //validation(doğrulama) için joi package'ını kullanıyoruz.


//*BURADA SCHEMA YAPTIK:çümkü joi dokumanına baktıgımızda böyle bir yapısı vardı.
// name'in özelliklerini girdik, örneğin string, required ve min:5 olması gibi
// bunlar validation'u sağlatan şeylerdir. Yani bu koşullar sağlanarak doğrulama yapılıyor.
const createValidation = Joi.object({ //joi.object : joi'de obje üret
    name: Joi.string().required().min(5),
});

const updateValidation = Joi.object({ 
    name: Joi.string().required().min(5),
});

//* validation yaparken, bir işlem geldiğinde araya girip doğrulama yapması ve validate sağlanıyorsa devam sağlanmıyosa iptal etmesi gerekmekte.
//* bunun için middileware kullancağız.




module.exports = {  // objede exports'ladık çünkü 1 den fazla validation yapılacak.
    createValidation,
    updateValidation,
};