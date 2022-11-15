
const validate= require('../middlewares/validate');     //validate middleware
const schemas = require("../validations/Users");       // validations
const authenticate = require('../middlewares/authenticate');
const express = require('express');
const { create, index, login, projectList, resetPassword } =  require("../controllers/Users"); 

const router = express.Router(); 


 router.get("/", index); 
 router.route("/").post(validate(schemas.createValidation), create);  
 router.route("/login").post(validate(schemas.loginValidation), login);  
 router.route("/projects").get(authenticate, projectList);  // authenticate'i yapmazsak request'in içindeki user'I set set etmez ve çalışmaz
 router.route("/reset-password").post(validate(schemas.resetPasswordValidation), resetPassword);



 

module.exports = router; 