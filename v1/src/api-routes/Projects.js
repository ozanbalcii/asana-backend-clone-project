
const validate= require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const schemas = require("../validations/Projects");
const express = require('express');
const { create, index, update } =  require("../controllers/Projects"); 
const router = express.Router(); // express'in router'ını kullanıyoruz.




router.route("/").get(authenticate, index);   
router.route("/").post(authenticate, validate(schemas.createValidation), create); 
router.route("/:id").patch(authenticate, validate(schemas.updateValidation), update); //! /:id -> projects id'ye göre yapmak için

module.exports = router; // bunu direkt bu şekilde export edersek, app.js(genel)'de ProjectRouters.router yapmamıza gerek kalmıyor.(orda da  belirttim.)