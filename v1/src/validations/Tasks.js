const Joi = require ("joi"); 

const createValidation = Joi.object({ 
    title: Joi.string().min(3),
    section_id : Joi.string().min(8), 
    project_id : Joi.string().min(8),
    description : Joi.string().min(3),
    assigned_to : Joi.string().min(3),
    due_date : Joi.date().min(3),
    statuses : Joi.array(),
    order : Joi.number(),
    isCompleted : Joi.boolean(),
    comments : Joi.array(),
    media :  Joi.array(),
    sub_tasks :  Joi.array(),  
}); 

const updateValidation = Joi.object({ 
    title: Joi.string().min(3),
    section_id : Joi.string().min(8), 
    project_id : Joi.string().min(8),
    description : Joi.string().min(3),
    assigned_to : Joi.string().min(3),
    due_date : Joi.date().min(3),
    statuses : Joi.array(),
    order : Joi.number(),
    isCompleted : Joi.boolean(),
    comments : Joi.array(),
    media :  Joi.array(),
    sub_tasks :  Joi.array(),
}); 

const makeCommentValidation = Joi.object ({
    comment : Joi.string().min(3),
    _id :  Joi.string().min(8),
    _destroy : Joi.boolean(),
});

 
module.exports = {  
    createValidation,
    updateValidation,
    makeCommentValidation,
};