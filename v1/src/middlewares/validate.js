const httpStatus = require("http-status");
const validate = (schema) => (req, res, next) => { 

     //* doc: https://joi.dev/api/?v=17.6.1  
    const { value, error }= schema.validate(req.body); 
    if(error){
        
        const errorMessage = error.details?.map(detail => detail.message).join(", ") //? error.details =[{message:""}, {message:""}] --> ["","",""] --> "aaa,bbb,ccc" 
        res
        .status(httpStatus.BAD_REQUEST)
        .json({
            error: errorMessage  
        });
        return;
    }
    Object.assign(req, value); //! bind
    return next();
}; 

module.exports = validate;