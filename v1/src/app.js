//*mvp yapısına böldük(config, loaders.. vs gibi ama her şey bu dosya üstünden ilerlemektedir.)
const express = require('express');
const fileUpload = require('express-fileupload');
const helmet = require('helmet');
const config = require("./config");
const loaders = require('./loaders');
const events = require("./scripts/events");

const {
    ProjectRoutes, // bu api-router Project.js yi gösteriyor, bunun tanımını api-router index.js de yaptım
    UserRoutes
 } =  require('./api-routes'); // {ProjectRoutes} --> ProjectRoutes'ın object olmasıdır.

config();
loaders();
events();

// const uuid = require("uuid");
// console.log( uuid.v4());



const app = express(); //? express'i app değişkeninde kullanmak için.
app.use(express.json()); //? body'deki bilgileri bize vermeye yarıyor
app.use(helmet()); //? helmet'i kullanıyoruz.
app.use(fileUpload());

//! application ile suncuyu bind(bağlıyoruz) ediyoruz.
app.listen(process.env.APP_PORT, () => { // port bilgisini .env'den alıyorum ve config() olmadan alamazdım çünkü env orada tanımlı.
    console.log("Server started, PORT:" + process.env.APP_PORT);
    app.use("/projects", ProjectRoutes); // reotuerı direkt export ettiğimiz için ProjectRouters.router yapmamıza gerek kalmıyor.
    app.use("/users",  UserRoutes); 
});   