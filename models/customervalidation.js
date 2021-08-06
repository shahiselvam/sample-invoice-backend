const joi = require("joi");


const customervalidation = (data) =>{

    const products = joi.object({

    CustomerName:joi.string().required(),
    Phone:joi.string().length(10).pattern(/^[0-9]+$/).required(),
    Email: joi.string().min(6).email().required(),
    Address:joi.string().min(6)

    });
    return products.validate(data);

}

module.exports = {

    customervalidation
}