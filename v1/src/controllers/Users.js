const {insert, list, loginUser, modify} = require ("../services/Users");
const projectService = require("../services/Projects");
const httpStatus = require("http-status");
const { passwordToHash, generateAccessToken,  generateRefreshToken } = require ("../scripts/utils/helper");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");
const { http } = require("winston");

const create = (req, res) => { //* create fonksiyonu, insert sayesinde yeni kullanıcı olusturmaktadır.
    req.body.password = passwordToHash(req.body.password); 
    insert(req.body)        
    .then((response) =>{     
        res
        .status(httpStatus.CREATED)     
        .send(response);
    })
    .catch((e) => { 
        res
        .status(httpStatus.INTERNAL_SERVER_ERROR) 
        .send(e);
    });
};

//login process:
const login =(req,res) => {
    req.body.password = passwordToHash(req.body.password); // loginde de password old için hashledik.
    loginUser(req.body)
    .then((user)=> { // user'ı bana döndüğü için user dedik. (response da diyebiliriz ama user demek daha dogrudur.)
        // burada if sorgusu ile  login olurken email ve password sorgusu yapılıyor.
        //* return koymazsak if'in altındaki satıra devam eder ve iki kere geriye döner
        if(!user) return res.status(httpStatus.NOT_FOUND).send({message: "Böyle bir kullanıcı yoktur."}) 

        //eğer user varsa buraya geliyor. 
        user = {  // user'ın mantığı şu: (models/user' da olusturdugumuz user collection'u kullanıyoruz.)
            ...user.toObject(), //user içindeki her şeyi buraya aktar. ve .toObject( ) objeye çevirdik.
            tokens : { // tokens olarak obje olusturduk.
                access_token : generateAccessToken(user), 
                refresh_token : generateRefreshToken(user),
            },
        };
        delete user.password;   
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
  

  

    // user'a ait projelerin listesini görmek için:
    //projectService : bize zaten projeleri listeliyor serviste/project'de. buradaki listeden aşağıda oldugu gibi list fonksiyonu ile user_id'ye find yapacağız. 
    // bunları yapmamız içinde  projectService getirdiğimiz yerdeki list'e where yazarak obje varsa alacağız. (list'in konumu /services/project'de cunku: userin projelerini alıyoruz. user listeleseydik, /services/user'dak, listi kullanırdık.     )
const projectList = (req, res) => {
    projectService 
    .list({ user_id : req.user?._id })  // req.user?._id; req.user? -> requestteki user'ın içinden _id aldık.
    .then(project => { 
        res.status(httpStatus.OK).send(project);
    })
    .catch (e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
       error: "The projects cannot fetch." 
    })
    );

};   




const resetPassword = (req, res) => {
 
    // uuid.v4()? : içinden almamızın ve split etmemizim nedeni buradan gelen xx-xx-xx şeklinde buradan 1. olanı alcaz ondan split ediyoruz. yapıyı console.log yaparak app.js'de bakabiliriz.
    const new_password = uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;  // yeni şifre olusturduk 2 türlü biri package ile biri manuel date ve time a göre
    modify({  email : req.body.email  }, {  password: passwordToHash(new_password)  })  //{email : req.body.email}-> services'dan aldıgımız user informations'dan email bilgisini çektik. {password: passwordToHash(new_password) ->  yeni olusturulan şifreyşi hashleyip eskisinin yerine kaydettik
    .then((updatedUser) => {
        if(!updatedUser) return res.status(httpStatus.NOT_FOUND).send({ error: "User not found, please try again."}); // updatedUser sorunluysa..

        eventEmitter.emit("send_mail", "data emitter", {
            to: updatedUser.email, // list of receivers
            subject: "Şifre Sıfırlama", // Subject line
            html: `Talebiniz üzerine şifre sıfırlama tamamlandı <br /> giriş yaptıktan sonra şifre değiştir <br /> Yeni Şifreniz: <b>${new_password}</b>`, // html body
        });
        res.status(httpStatus.OK).send({
            message:"şifre sıfırlama için bilgiler email olarak yollandı"
        })

        

    })
    .catch (() => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: "Your password cannot be reset. Please, can you try again?"}))
};







module.exports = {
    index,
    create,
    login,
    projectList,
    resetPassword,
};