// password'u hash'leme işlemini bir çok yerde kullanabiliriz, bunun için burada hashlama yapacağız.
// password hash'i Controllers users'da create'da kullancaz, çünkü create olmadan önce şifreyi gizlicez.


const CryptoJS = require('crypto-js');

const passwordToHash = (password) => { // password'u çektik
    //iç içe çift şifreleme yaparak güvenliği arttıracağız.
    // HmacSHA1 ile password'u şifrelicez. bize bir softkey gelmesi lazım bu .env dosyasından gelecek, orada olusturduk kendimiz
    // https://www.npmjs.com/package/crypto-js' a göre yazdık fakat KENDİMİZ İÇ İÇE YAZDIK. BUNLARI AYRI AYRI VERMİŞTİ DOKUMANDA.
    return CryptoJS.HmacSHA256(password, CryptoJS.HmacSHA1(password, process.env.PASSWORD_HASH).toString()).toString();
};

module.exports = {
    passwordToHash,
};


