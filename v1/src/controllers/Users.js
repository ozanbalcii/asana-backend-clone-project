const {insert, list, loginUser} = require ("../services/Users");
const httpStatus = require("http-status");
const { passwordToHash } = require ("../scripts/utils/helper");

const create = (req, res) => {
    req.body.password = passwordToHash(req.body.password); // hashlama yapıldı.
    
    insert(req.body)        //*req.body'den name alcaz yani: postmanden(front end) name vercez.(insert öylesine verilmiş bir isimdir.)
    .then((response) =>{     // dogruysa then ile response(cevap) döndü.
        res
        .status(httpStatus.CREATED)     //http status npm paketine ait özellik : httpStatus.CREATED BİZİM İÇİN EĞER DÜZGÜN ÇALIŞTIYSA BURADA STATUS : 200
        .send(response);
    })
    .catch((e) => { // ynls ise catch'le yakala
        res
        .status(httpStatus.INTERNAL_SERVER_ERROR) // HATA VARSA KENDİSİ ERROR STATUS SAYISINI DÖNDÜRÜYOR PAKET SAYESİNDE
        .send(e);
    });
};

//login process:
const login =(req,res) => {
    req.body.password = passwordToHash(req.body.password);
    loginUser(req.body)
    .then((user)=> { // user'ı bana döndüğü için user dedik.
        // burada if sorgusu ile  login olurken email ve password sorgusu yapılıyor.
        // return koymazsak iki kere geriye döndürür ve if'ten sonra çalışmaya devam eder
        if(!user) return res.status(httpStatus.NOT_FOUND).send({message: "Böyle bir kullanıcı yoktur."})       
        res.status(httpStatus.OK).send(user);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};



// index'in amacı: bütün projenin response'unu alabilmemize yarıyor.
// altta da yorumda yazdım response'ye sonucları attık, response sayesinde sonucları döndürebiliyoruz index'te
const index = (req, res) => { // get requestliyoruz ve bize kaydedilen userları veriyor.

    list()  //servise'de kayıt ediyorduk ve altta list olusturduk. burada sonuçları find ile döndürdük. burada response alıyorduk, response=cevap oldugu için ise repsonse'de sonuçlar döndü.
        .then(( response ) => {
        res
        .status(httpStatus.OK)
        .send(response);
        })
        .catch((e) => res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send(e));   
    };
  

module.exports = {
    create,
    index,
    login
};