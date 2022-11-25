const Mongoose = require('mongoose');
const logger = require("../scripts/logger/Sections"); 


const TaskSchema = new Mongoose.Schema( 
{
    title: String,
    description : String,
    assigned_to : {
        type: Mongoose.Types.ObjectId,
        ref : "user"
    },
    due_date : Date,
    statuses : [String],

    user_id : {  
        type: Mongoose.Types.ObjectId,
        ref : "user"
    },

    section_id : {  
        type: Mongoose.Types.ObjectId,
        ref : "section"
    },

    project_id : { 
        type : Mongoose.Types.ObjectId,
        ref : "project"
    },

    order : Number,
    isCompleted : Boolean,
    comments : [
        {
            comment : String,
            comment_at : Date,
            user_id : {
                type : Mongoose.Types.ObjectId,
                ref: "user",
            },         
        },
    ],
    media : [String],
    sub_tasks : [
       { 
            type : Mongoose.Types.ObjectId,
            ref: "task ",
       }
    ],
    },
    {timestamps: true, versionKey: false} 
);


//! logger
TaskSchema.post("save" ,(doc)=>{    
    logger.log({   
        level :"info",
        message : doc,
    });
});

module.exports = Mongoose.model("task", TaskSchema);