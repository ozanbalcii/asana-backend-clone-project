const httpStatus = require("http-status");
const Mongoose = require("mongoose");
const TaskService = require("../services/TaskService"); 

 class Task {
    create(req, res){
        req.body.user_id =  req.user;  
        TaskService.create(req.body)
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
        TaskService.list({projectId : req.params.projectId })
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
            TaskService.update( req.params?.id, req.body)
                .then(updatedDoc => {
                 res.status(httpStatus.OK).send(updatedDoc);
            })
                .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:"kayıt sırasında problem olustu."}))
    };
    
     deleteTask(req, res){ 
        if(!req.params?.id) {    //* id bilgisi kontrolü
            return res.status(httpStatus.BAD_REQUEST).send({
                message :"id bilgisi eksik"});
        };
        TaskService.delete(req.params?.id) 
        .then ((deleteDoc) => {
             if(!deleteDoc) {
                return res.status(httpStatus.NOT_FOUND).send({
                        message:"böyle bir task yoktur."});
            };
            res.status(httpStatus.OK).send({ 
                message : "task silinmiştir."
            });
        })
        .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:"kayıt sırasında problem olustu."}))
    };

     makeComment(req, res) { 
            req.body.user_id = req.user;  
            req.body.comment_at = new Date();
    
            if(!req.params.id)  return res.status(httpStatus.BAD_REQUEST).send({message :"böyle bir kayıt yoktur"});
            TaskService.findOne({ _id: req.params.id})
            .then(mainTask => { 
                if(!mainTask) return res.status(httpStatus.BAD_REQUEST).send({message :"böyle bir kayıt yoktur"});
                const comment = {
                    ...req.body, 
                    commented_at : new Date(),
                    user_id : req.user,
                };
                mainTask.comments.push(comment);
                mainTask
                .save()
                .then(updatedDoc => {
                    return res.status(httpStatus.OK).send(updatedDoc)
                })
                .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:"kayıt sırasında problem olustu."}))
            })
            .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:"kayıt sırasında problem olustu."}))
    };
    
    deleteComment(req,res) {   
            TaskService.findOne({ _id: req.params.id})
            .then(mainTask => {
                if(!mainTask) return res.status(httpStatus.BAD_REQUEST).send({message :"böyle bir kayıt yoktur"});
                mainTask.comments =  mainTask.comments.filter((c) => c._id?.toString() != Mongoose.Types.ObjectId); 
                mainTask
                .save()
                .then(updatedDoc => {
                    return res.status(httpStatus.OK).send(updatedDoc)
                })
                .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:"kayıt sırasında problem olustu."}))
            })
            .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:"kayıt sırasında problem olustu."}))
    };
    addSubTask(req, res){ 
        if(!req.params.id) return res.status(httpStatus.BAD_REQUEST).send({error:"id bilgisi gereklidir."});
        TaskService.findOne({ _id: req.params.id})
        .then(mainTask => {    
            if(!mainTask) return res.status(httpStatus.NOT_FOUND).send({message :"böyle bir kayıt yoktur"}); 
            TaskService.create({...req.body, user_id: req.user})
            .then((subTask) =>{   
              mainTask.sub_tasks.push(subTask) 
              mainTask
              .save()
              .then((updatedDoc) => {
                return res.status(httpStatus.OK).send(updatedDoc)
                 })
                 .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:"kayıt sırasında problem olustu."}))
           })
            .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:"kayıt sırasında problem olustu."})) 
    
        })
        .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:"kayıt sırasında problem olustu."}))
    };

    fetchTask (req, res ){  
        if(!req.params.id)  return res.status(httpStatus.BAD_REQUEST).send({message :"ID bilgisi gereklidir"});
        TaskService.findOne({ _id: req.params.id}, true)
        .then(task => { 
            if(!task) return res.status(httpStatus.BAD_REQUEST).send({message :"böyle bir kayıt yoktur"});
                res.status(httpStatus.OK).send(task)
        }).catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:"kayıt sırasında problem olustu."}))
    };
 };
 module.exports = new Task();

