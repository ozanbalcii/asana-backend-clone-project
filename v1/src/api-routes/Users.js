const validate= require('../middlewares/validate');    
const schemas = require("../validations/Users");       
const express = require('express');
const UserController =  require("../controllers/User"); 
const  authenticate = require("../middlewares/authenticate");
const idChecker = require('../middlewares/idChecker');
const router = express.Router(); 


 router.get("/", UserController.index); 
 router.route("/").post(validate(schemas.createValidation), UserController.create);  
 router.route("/login").post(validate(schemas.loginValidation), UserController.login);  
 router.route("/:id").delete(idChecker(), authenticate, UserController.deleteUser);  
 router.route("/reset-password").post(validate(schemas.resetPasswordValidation),UserController.resetPassword);  
 router.route("/change-password").post(authenticate, validate(schemas.changePasswordValidation),UserController.changePassword);  
 router.route("/update-profile-image").post(authenticate, UserController.updateProfileImage);  
 router.route("/update").patch(authenticate, validate(schemas.updateValidation),UserController.update);
 router.route("/projects").get(authenticate, UserController.projectList);  


module.exports = router; 