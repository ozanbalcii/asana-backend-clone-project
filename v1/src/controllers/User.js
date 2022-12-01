const httpStatus = require("http-status");
const { passwordToHash, generateAccessToken, generateRefreshToken } = require ("../scripts/utils/helper");
const uuid = require("uuid");
const path = require("path");
const UserService = require("../services/UserService");
const ProjectsServices = require("../services/ProjectsService"); 

class User {

    create(req, res){ 
        req.body.password = passwordToHash(req.body.password); 
        UserService.create(req.body)     
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

    login(req,res){
        req.body.password = passwordToHash(req.body.password); 
        UserService.findOne(req.body)
        .then((user)=> {
            if(!user) return res.status(httpStatus.NOT_FOUND).send({message: "Böyle bir kullanıcı yoktur."})  
            user = {  
                ...user.toObject(), 
                tokens : { 
                    access_token : generateAccessToken(user), 
                    refresh_token : generateRefreshToken(user),
                },
            };
            delete user.password;   
            res.status(httpStatus.OK).send(user);
        })
        .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
    };
    
    index(req, res){ 
            UserService.list()
            .then(( response ) => {
                res
                .status(httpStatus.OK)
                .send(response);
             })
                .catch((e) => res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .send(e));   
    };  
    
    projectList(req, res){  
        ProjectsServices
        .list({user_id : req.user?._id})
        .then(projects => {
            res.status(httpStatus.OK).send(projects)
        })
        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR))
        .send({error: "projeleri getirirken bir hata meydana gelmiştir."})
    };
    
    resetPassword(req, res){
        const new_password = uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`; 
      UserService.updateWhere({email: req.body.email}, {password: passwordToHash(new_password)})
       .then(updatedUser => {
            if(!updatedUser) return res.status(httpStatus.NOT_FOUND).send({error:"böyle bir kullanıcı bulunmamaktadır."})
             res.status(httpStatus.OK).send(updatedUser);  
       })
       .catch (e=> res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:"resetlerken bir sorun cıktı"}))
    };
       
    update (req, res){
        UserService.update(req.user?._id, req.body)
        .then(updatedUser => {
            res.status(httpStatus.OK).send(updatedUser);
        })
        .catch(()=>res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: "güncelleme yapılırken bir problem olustu"}));
    };
    
    changePassword(req, res){
        req.body.password = passwordToHash(req.body.password);    
        UserService.update(req.user?._id, req.body)
        .then((updatedUser) => {
            res.status(httpStatus.OK).send(updatedUser);
        })
        .catch(()=>res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: "güncelleme yapılırken bir problem olustu"}));
    }  
    
    deleteUser(req, res){
        if(!req.params?.id) {   
            return res.status(httpStatus.BAD_REQUEST).send({
                message :"id bilgisi eksik"});
        };
        UserService.delete(req.params?.id) 
        .then ((deletedItem) => {
             if(!deletedItem) {
                return res.status(httpStatus.NOT_FOUND).send({
                        message:"böyle bir kayıt yoktur."});
            };
            res.status(httpStatus.OK).send({  
                message : "user silinmiştir."
            })
        })
        .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:"kayıt sırasında problem olustu."}))
    };

    updateProfileImage(req, res){
       if(!req?.files?.profile_image) { 
            return res.status(httpStatus.BAD_REQUEST).send({
                error:"Lütfen profil fotoğrafı için resim seçiniz."});
       };
        
       //! upload
        const extension = path.extname(req.files.profile_image.name);
        const fileName = `${req?.user._id}${extension}`;
        const folderPath = path.join(__dirname, "../", "uploads/users", fileName); 
        req.files.profile_image.mv(folderPath, function(err) { 
            if(err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: err});
            UserService.update( req.user._id, {profile_image: fileName})
             .then((updatedUser) =>{
                 res.status(httpStatus.OK).send(updatedUser);
                })
            .catch(()=>res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: "güncelleme yapılırken bir problem olustu"}))
            });
    };   
};

// const new_password = uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;    
//         UserService.updateWhere({email: req.body.email}, {password: passwordToHash(new_password)})
//        .then((updatedUser) => {
//             if(!updatedUser) return res.status(httpStatus.NOT_FOUND).send({error:"böyle bir kullanıcı bulunmamaktadır."})
//              res.status(httpStatus.OK).send(updatedUser);  
//        })
//        .catch (e=> res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:"resetlerken bir sorun cıktı"}))

module.exports = new User();
