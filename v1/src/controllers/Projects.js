//logical işlemler(matıksal) burada gerçekleşiyor

const {insert, list} = require ("../services/Projects");
const httpStatus = require("http-status");


const create = (req, res) => {
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
    index
};











