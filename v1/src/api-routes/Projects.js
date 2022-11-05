
const validate= require('../middlewares/validate');
// //*validate'in içinde schema olması lazım, onun için schmeas olusturuldu. ALTTA DA VALİDATE'E SCHEMA'YI EKLİYORUZ.
const schemas = require("../validations/Projects");
const express = require('express');
const { create, index } =  require("../controllers/Projects"); 
const router = express.Router(); // express'in router'ını kullanıyoruz.




// get request gelince create çalışıyor ardından creat'in konumu /controllers/Projects old için buraya gidiyor.
 router.get("/", index); //mvp mimarisinden şaşmamak için ve gereksiz kod kirliliğinden kaçınmak için bu kodun belli ksımını create'de yazdım. ve get olunca create çalışıyor.

 router
 .route("/")
//validate'e schema lazım olan validate'nin kendi schema'sı = schemas.createValidation burada.
//çünkü orada string olması, min:5 harf olması gibi koşullar var, onları validate ederse çalışacak.
 .post(validate(schemas.createValidation), create);  // "/" gelince create'den once validate çalışacak.





module.exports = router; // bunu direkt bu şekilde export edersek, app.js(genel)'de ProjectRouters.router yapmamıza gerek kalmıyor.(orda da  belirttim.)



 






