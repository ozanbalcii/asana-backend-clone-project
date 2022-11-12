const {insert, list, loginUser} = require ("../services/Users");
const projectService = require("../services/Projects");
const httpStatus = require("http-status");
const { passwordToHash, generateAccessToken,  generateRefreshToken } = require ("../scripts/utils/helper");


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
    // services/project'daki list fonk'da where kullanıp obje varsa al yaparsak burada da kullanabiliriz list'i.
const projectList = (req, res) => {
    req.user?._id;
    projectService.list({ user_id:req.user?._id }).then(project => {
        res.status(httpStatus.OK).send(project);
    })
    .catch (e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
       error: "The project cannot fetch." 
    }))

}   

module.exports = {
    index,
    create,
    login,
    projectList,
};