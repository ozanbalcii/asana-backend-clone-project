//logical işlemler(matıksal) controllers'da gerçekleşiyor

const {insert, modify, list} = require ("../services/Projects");
const httpStatus = require("http-status");


const create = (req, res) => {
    req.body.user_id = req.user;// models user_id'nin tpye ve ref'ini biliyor. Bundan dolayı bir obje yollandıgında models'daki tanımlamalar sayesinde user_id'yi alacak ve user_name olarak kullanacak. Yani postmande çıkışta user_name gözükmeyecek user_id gözükecek. 
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

const update = (req, res) => { 
  if(!req.params?.id){
    //*req'deki params'ın içinde id yoksa.. (return demezsek kullanamz ve asagı devam eder. RETURN DEDİĞİMİZ İÇİN ELSE KOYMAMIZA GEREK YOKTUR.)
    return res.status(httpStatus.BAD_REQUEST).send({ 
    message: "ID information missing"
  });
}
// id var ise: update yap
modify(req.body, req.params.id).then(updatedProject => {  // req.body ve id= req.params.id yolluyoruz.
    res.status(httpStatus.OK).send(updatedProject)
}).catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: "has a problem while recording"}))
};
  

module.exports = {
    create,
    index,
    update,
};