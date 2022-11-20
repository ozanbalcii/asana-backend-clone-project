const {insert, list, loginUser, modify, remove} = require ("../services/Users");
const projectService = require("../services/Projects");
const httpStatus = require("http-status");
const { passwordToHash, generateAccessToken,  generateRefreshToken } = require ("../scripts/utils/helper");
const uuid = require("uuid");
const { http } = require("winston");
const path = require("path"); //! klasör işlemler için bunu profile image'da kullandık

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
    .list({ user_id : req.user?._id })  // req.user?._id; req.user? -> requestteki user'ın içinden _id aldık. (models/project -> bırdan user_id aldık)
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
    
        res.status(httpStatus.CREATED) .send({message:"Password changed successfully!"});    
    })
    .catch (() => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: "1Your password cannot be reset. Please, can you try again?"}))
    
};


const update = (req, res) => {

if(!req.user){  // bu adımı yapmasakta olur, yani kullaınıcı giriş kontrolü, çünkü authenticate yapınca buna gerek kalmaz
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        error: "  firstly one, login to Asana Clone for this process "
    });
};
modify({ _id: req.user?._id}, req.body)
.then(updatedUser => { // modify yazıp üstüne gelince içinde ne olması gerektiğini gösteriyor: where, data diyo. (where'de obje vardı.
res.status(httpStatus.OK).send(updatedUser)
})
.catch(()=> res.status( httpStatus.INTERNAL_SERVER_ERROR).send({error: "Error, Cannot update information"}));
};


const changePassword = (req, res) => {
    req.body.password = passwordToHash(req.body.password);
modify({ _id: req.user?._id}, req.body)
.then(updatedUser => { 
    res.status(httpStatus.OK).send(updatedUser)
})
.catch(()=> res.status( httpStatus.INTERNAL_SERVER_ERROR).send({error: "Error, Cannot update information"}));
};


const deleteUser = (req, res) => {
    if(!req.params?.id){ // id bilgisi router'dan geliyor.
      return res.status(httpStatus.BAD_REQUEST).send({ 
      message: "ID information missing"
    });
  }
  
    remove(req.params?.id) 
      .then((deleteUser) => {  // req.body ve id= req.params.id yolluyoruz.
  
        if(!deleteUser){
            return res.status(httpStatus.NOT_FOUND).send({
              message: "User Records cannot find"
          });
        };
  
        res.status(httpStatus.OK).send({
          message: "Info: User record deletion completed."
        });
      })
      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({error: "Error: Cannot process delete!"}));
};


  const updateProfileImage = (req, res ) => {
    
    //! resmi kontrolü
    if(!req?.files?.profile_image){ // req içindeki fillerin içinde profile_image yoksa..
        return res.status(httpStatus.BAD_REQUEST).send({ error: "Bu işlem için yeterli veri yok."})
    };
    // console.log(__dirname); //! çalıştırılan dosyanın yolunu veriyor. bunun altında hemen return false; yazdım ve bunun yoluna baktıgımda ilk başta clone v1\v1\src\controllers veriyordu. bizim src'ye gelmemiz lazım ki buradan upload'da gelip resimi yükleyebilelim.
    //                         //? bu src'ye gelme işini path(yukarda tanımladık bu iş için) ve join ile sağlayacağız.
    // console.log(path.join(__dirname, "../", "uploads/users")); //! mesela bu şekilde upload/users'a direkt geldik.
    
    //! resmi kaydetme
    const extension = path.extname(req.files.profile_image.name);// kaydedilen resmin filename i çin yapıoz 
    const fileName = `${req?.user._id}.${extension}`;// kaydedilen resmin filename i çin yapıoz 

    const folderPath = path.join(__dirname, "../", "uploads/users", fileName); 
    req.files.profile_image.mv(folderPath, function (err) {
    if(err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err});
    modify({_id: req.user._id}, {profile_image : fileName })
    .then(updatedUser => {
        res.status(httpStatus.OK).send(updatedUser)
    })
    .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: " upload başarılırı ama kayıt başarısız."}))
    });  // mv, resimin bir değişkeni buna göre alıyoruz. console.log(req.file) yazınca cıkıyor
  };











module.exports = {
    index,
    create,
    login,
    projectList,
    resetPassword,
    update,
    deleteUser,
    changePassword,
    updateProfileImage,
};