const httpStatus = require("http-status");
const ProjectsService = require("../services/ProjectsService"); 
const ApiError = require("../errors/ApiError")

class Project {
    index (req, res) { 
    ProjectsService  
    .list()  
    .then(( response ) => {
    res
    .status(httpStatus.OK)
    .send(response);
    })
    .catch((e) => res
    .status(httpStatus.INTERNAL_SERVER_ERROR)
    .send(e));   
    };

    create (req, res){
    req.body.user_id =  req.user;  
    ProjectsService.create(req.body)   
    .then((response) =>{     
        res
        .status(httpStatus.CREATED)     
        .send(response);
    })
    .catch((e) => { 
        res
        .status(httpStatus.INTERNAL_SERVER_ERROR) 
        .send(e);
    });
    };

    update (req, res, next){  
    if(!req.params?.id) {
        return res.status(httpStatus.BAD_REQUEST).send({
            message :"id bilgisi eksik"});
    };
    ProjectsService.update(req.params?.id, req.body)
    .then((updatedProject) => {
        //!ERROR HANDLER YAPISI:
        if(!updatedProject) return next(new ApiError("Böyle bir kayıt bulunmamaktadır.",404));
        res.status(httpStatus.OK).send(updatedProject);
    })
    .catch((e) => next(new ApiError(e?.message)));
    };

    deleteProject (req, res) {
    if(!req.params?.id) {   
        return res.status(httpStatus.BAD_REQUEST).send({
            message :"id bilgisi eksik"});
    };
    ProjectsService.delete(req.params?.id)
    .then ((deleteProject) => {
         if(!deleteProject) {
            return res.status(httpStatus.NOT_FOUND).send({
                    message:"böyle bir kayıt yoktur."});
        };
        res.status(httpStatus.OK).send({  
            message : "proje silinmiştir."
        })
    })
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:"kayıt sırasında problem olustu."}))
    };
}
module.exports = new Project();