
const validate= require('../middlewares/validate');     //validate middleware
const schemas = require("../validations/Users");       // validations
const express = require('express');
const { create, index, login, projectList, resetPassword, update } =  require("../controllers/Users"); 
const  authenticate = require("../middlewares/authenticate");

const router = express.Router(); 



 
 router.get("/", index); 
 router.route("/").post(validate(schemas.createValidation), create);  
 router.route("/login").post(validate(schemas.loginValidation), login);  
 router.route("/reset-password").post(validate(schemas.resetPasswordValidation), resetPassword);  
 router.route("/update").patch(authenticate, validate(schemas.updateValidation), update);  //! authenticate yaptıgımız için /:id dememize gerek yok cunku user'ın kim oldugunu authenticate sayesinde biliyoruz
 router.route("/projects").get(authenticate, (projectList));  // authenticate'i yapmazsak request'in içindeki user'ı set set etmez ve çalışmaz




module.exports = router; 



 







