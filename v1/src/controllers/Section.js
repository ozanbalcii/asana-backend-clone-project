const httpStatus = require("http-status");
const SectionService = require("../services/SectionService") 

class Section {
    create(req, res){
        req.body.user_id =  req.user;  
            SectionsService.create(req.body)
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

    index(req, res){ 
        if(!req?.params?.projectId) return res.status(httpStatus.BAD_REQUEST).send({error:"proje bilgisi eksik"});
        SectionService.list({projectId : req.params.projectId }) 
            .then(( response ) => {
            res
            .status(httpStatus.OK).send(response);
            })
            .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));   
    };

    update(req, res){
      
        if(!req.params?.id) { 
            return res.status(httpStatus.BAD_REQUEST).send({
                message :"id bilgisi eksik"});
        };
        SectionService.update(req.params?.id, req.body)
        .then(updatedDoc => {
            res.status(httpStatus.OK).send(updatedDoc);
        })
        .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:"kayıt sırasında problem olustu."})) 
    };

    deleteSections(req, res){
        if(!req.params?.id) {   
            return res.status(httpStatus.BAD_REQUEST).send({
                message :"id bilgisi eksik"});
        };
        SectionService.delete(req.params?.id) 
        .then((deleteDoc) => {
             if(!deleteDoc) {
                return res.status(httpStatus.NOT_FOUND).send({
                        message:"böyle bir section yoktur."});
            };
    
            res.status(httpStatus.OK).send({  
                message : "section silinmiştir."
            })
        })
        .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:"kayıt sırasında problem olustu."}))
    };
    
}
module.exports = new Section();