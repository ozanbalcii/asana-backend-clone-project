const Project = require("../models/Projects");

const insert = (data) => { // register
    const project = new Project(data); 
    return project.save();  
};                           
                             
                            
const list = () => {
    return Project.find({});  
}


module.exports = {
    insert,
    list,
};
