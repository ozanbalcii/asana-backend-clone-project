const httpStatus = require("http-status");
const ApiError = require("../errors/ApiError");

const idChecker = (field) => (req, res, next)=>{
 const idField = field || "id";
    if(!(req?.params[idField]?.id?.match(/^[0-9a-fA-F]{24}$/))){ 
        next(new ApiError("Lütfen Geçerli Bir ID Bilgisi Giriniz!"), httpStatus.BAD_REQUEST);
            return; 
    }
     next();
}
module.exports = idChecker;