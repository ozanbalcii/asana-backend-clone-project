const BaseService = require("./BaseService");
const BaseModel = require("../models/Tasks");

class TaskService extends BaseService {  
    constructor() {
        super(BaseModel);     
         };  
          findOne(where, expand){
            if(!expand) return this.BaseModel.findOne(where); 
            return this.BaseModel.findOne(where)
            .populate([
                {
                    path: "user_id",
                    select : "full_name email profile_image"
                },
                { 
                    path: "comments",
                        populate :{
                            path : "user_id",
                            select : "full_name email profile_image",
                        }
                    }
            ])   
        };
};

module.exports = new TaskService(); 