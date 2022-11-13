// token middlware'si:

const httpStatus = require("http-status");
const JWT = require("jsonwebtoken");

// token'nın doğrulamasını yapıyoruz:
const authenticateToken = (req, res, next) => { 

    // authorization adı altında bu bilgiyi yollucaz
    // req.headers.authorization  bunu da kullanabilirdik.
    // const authHeader = req.headers["authorization"]; // authorization'u header'dan alıyoruz.
    // const token = authHeader && authHeader.split(" ")[1];   //accesstoken'I alıyoruz split ile
    const token = req.headers?.authorization?.split(" ")[1] || null ; // hemen üst satırdakinin alternatifi
if(token == null){ // token yoksa, gönderilmez ise..
 return res.status(httpStatus.UNAUTHORIZED).send({ error: "bu islemi yapmak için ilk olarak giris yapmalısınız."});
}

// token varsa verify olur:
JWT.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => { 
 if(err) return res.status(httpStatus.FORBIDDEN).send({ error: err}); // token süresi geçerse if'e takılır.
    // token süresi geçmemişse requeste user'ı ekleriz. request üstünden gerçekleştiği yaptık ve user eklememizin sebebi user'la ilgili bişey yapabilelim diyedir.
 req.user = user?._doc; //*user'In içindeki docu'u user olarak yaz, yani req.body'de sadece user bilgileri olacak
 next();
});
};

module.exports = authenticateToken;