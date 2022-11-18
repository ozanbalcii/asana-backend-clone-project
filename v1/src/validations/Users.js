const Joi = require ("joi"); //validation(doğrulama) için joi package'ını kullanıyoruz.



const createValidation = Joi.object({ //joi.object : joi'de obje üret
    full_name: Joi.string().required().min(3),
    password: Joi.string().required().min(8),
    email: Joi.string().email().required().min(8),
});

const loginValidation = Joi.object({ 
    password: Joi.string().required().min(8),
    email: Joi.string().email().required().min(8),
});

const resetPasswordValidation = Joi.object({   
    email: Joi.string().email().required().min(8),
});
const updateValidation = Joi.object({   
    full_name: Joi.string().min(3),
    email: Joi.string().email().min(8),
});


//* validation yaparken, bir işlem geldiğinde araya girip doğrulama yapması gerekmektedir.
// bunun için middileware kullancağız.

module.exports = {  // objede exports'ladık çünkü 1 den fazla validation yapılacak.
    createValidation,
    loginValidation,
    resetPasswordValidation,
    updateValidation,
    
}