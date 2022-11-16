//TÜM VALİDATİON İŞLEMLERİNİN BEYNİNİ BURDA OLUSTURDUK, HANGİ ŞEYLERİ KONTROL EDECEĞİNE VALİDATİON DOSYASI ALTINDA BAKIYORUZ, BURDA DA BEYNİ ÇAŞIŞYOR BAKILACAK ŞEYLERE GÖRE
//* router'da geliyo validate'de bak eğer geçiyorsa devam geçmiyorsa error ver.
// middleware'ler router seviyesindeler, bundan dolayı middleware'leri router dosyasında kullnacaz
// validate'den geçermiyorsa durdurması lazım, bunun içinde araya girmeli, bundan dolayı middleware kullandık.
// BODY'E gelen bilgiyi kontrol etmektedir. bu daha sonra kontrol ettiği yerler artacak. body kontrolünü joi ile yapıyoruz.

const httpStatus = require("http-status");
const validate = (schema) => (req, res, next) => { //*burada kurulan yapı, middleware'in genel sabit yapısıdır.

     // https://joi.dev/api/?v=17.6.1   buradan bakarak yazdım:
     //burada validate'ten true cıkarsa value, çıkamaz ise false old için.
    const { value, error }= schema.validate(req.body); // req.body'de data var ondan buraya yazdım
    if(error){
        // alttaki kod sayesinde, error.details =[{message:""}, {message:""}] buna dönüşüyor: ["","",""] ve "aaa,bbb,ccc" haline geldi en son join sayesinde.
        const errorMessage = error.details?.map((detail) => detail.message).join(", ") //* sadece error mesajlarını bana array içinde dön yaptık burda.
        res
        .status(httpStatus.BAD_REQUEST)
        .json({
            error: errorMessage  //error message ile yolladık
        });
        return;
    }
    //returnleri koyunca sorun olmuyor ya da  araya else diyip de yapabilirdik
    Object.assign(req, value); //*validate'den çıkan veri ile requestimi bind(bağlamak) edeceğiz.
    return next();  //* validate'i sağlıyorsa if'e girmeyip buraya gelio ve next ile middleware'ı geçerek program çalışmaya başlıyor.

}; 


module.exports = validate;