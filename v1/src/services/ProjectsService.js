const BaseService = require("./BaseService");
const BaseModel = require("../models/Projects");

class ProjectsService extends BaseService {  //? BaseService'i extend ile inheritledik 

    //* BaseService'in methodlarını kullanabilmek için: constuructor'da super method'unu çalıştırmam lazımdır.
    constructor() {
        super(BaseModel);
                //? Inheritance:  (ProjectService'in ismi Porject, Projectin ismi Projects_ yapıldı.)
                //! Super method'u ile BaseService'in( extends olan = BaseService ) consturctor'ına BaseModel'i yolladık.
                //!  BaseModel "models/Projects" olarak require edilmiştir. Projects.js'deki metotları kullanabilmek için yapıldı.
                //! Böylelikle BaseService.js'de artık inherit edilen BaseModel'i kullanabiliyoruz.
                //* ZATEN SERVİCE KATMANININ BİR ALTI MODELS(YANİ SERVİCE MODELS'İ KULLANIYO),
                //* BİZDE SERVİCE'DEKİ KODLARI OOP'YE GÖRE YENİDEN DÜZENLİYORUZ O
                //* YÜZDEN BURADA REQUİRE MODELS/PROJECTS YAPTIK.
         };

         //* services/projects'de list metotunda populate işlemi var, biz gidip bunu BaseService'da yaparsak,
         //? başka yerde kullanılan list'de popoulate kullanılmıyor veya farklı kullanılıyor oldugundan
         //* BaseService'de yapamayız.
         //? bunu için ise burada kendi özelliği olarak yani sadece project'de kullanılması için popoulate işlemini
         // *burada yapıcaz. Access Modifiers (Private, Public, Protected) muhabbeti devreye giriyor.
         //! yani genel ifadeler BaseService'de, kendi katmanına özel şeyler ise burada yapılacak.
         
        list (where) {  
            return BaseModel.find(where || {}).populate({  
                path: "user_id",  
                select: "full_name email profile_image"
            });
        };
};

module.exports = new ProjectsService(); 