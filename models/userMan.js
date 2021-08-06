const joi = require("joi");


const rightsValidation = (data) =>{
    const scheme = joi.object({
   User_Id:joi.required(),
   Create:joi.required(),
   View: joi.required(),
   Edit: joi.required(),
   Delete: joi.required(),
   Print:joi.required()
          
    })
   
    return scheme.validate(data);
   
   
   }

module.exports = {

    rightsValidation
}