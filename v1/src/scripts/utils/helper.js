// token işlemleri ve password haslama işlemleri yapılacak.
// password'u hash'leme işlemini bir çok yerde kullanabiliriz, bunun için burada hashlama yapacağız.
// password hash'i Controllers users'da create'da kullancaz, çünkü create olmadan önce şifreyi gizlicez.

const CryptoJS = require('crypto-js');
const JWT = require("jsonwebtoken");


const passwordToHash = (password) => { // password'u çektik
    //iç içe çift şifreleme yaparak güvenliği arttıracağız.
    // HmacSHA1 ile password'u şifrelicez. bize bir softkey gelmesi lazım bu .env dosyasından gelecek, orada olusturduk kendimiz
    // https://www.npmjs.com/package/crypto-js' a göre yazdık fakat KENDİMİZ İÇ İÇE YAZDIK. BUNLARI AYRI AYRI VERMİŞTİ DOKUMANDA.
    return CryptoJS.HmacSHA256(password, CryptoJS.HmacSHA1(password, process.env.PASSWORD_HASH).toString()).toString();
};



// token process:(token, şifre ile alakalı oldugu için burada yapıyoruz.)
// generateAccessToken  ve  generateRefreshToken ları user'a göre üretiyoruz(bundan dolayı parametre user girildi) 
const generateAccessToken = (user) => {
    //{name: user.email, ...user} --> email bilgisin aldık, userın kendisini aldık
    return JWT.sign({name: user.email, ...user}, process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn: "1w"});
};
const generateRefreshToken = (user) => {
    return  JWT.sign({name: user.email, ...user}, process.env.REFRESH_TOKEN_SECRET_KEY);
};

module.exports = {
    passwordToHash,
    generateAccessToken,
    generateRefreshToken,
};