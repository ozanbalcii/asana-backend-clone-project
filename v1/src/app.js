const express = require('express');
const fileUpload = require("express-fileupload");
const helmet = require('helmet');
const config = require("./config");
const loaders = require('./loaders');
const errorHandler = require("./middlewares/errorHandler");
const path = require("path");
const {ProjectRoutes, UserRoutes, SectionRoutes, TasksRoutes } =  require('./api-routes'); 


config();
loaders();


const app = express();

app.use(express.json());
app.use(helmet()); 
app.use(fileUpload()); 
app.use("/uploads", express.static(path.join(__dirname, "./","uploads"))); 

app.listen(process.env.APP_PORT, () => { 
    console.log("Sunucu ayağa kalktı, PORT:" + (process.env.APP_PORT));
    app.use("/projects", ProjectRoutes); 
    app.use("/users", UserRoutes); 
    app.use("/sections", SectionRoutes); 
    app.use("/tasks", TasksRoutes); 

    //! error handler:
    app.use((req, res, next) => {      
    const error = new Error("Aradağınız sayfa bulunmamaktadır.");
    error.status = 404;
    next(error);
   });

   app.use(errorHandler);  
});