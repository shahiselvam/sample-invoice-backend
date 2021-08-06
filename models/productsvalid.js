const joi = require("joi");


const productvalidation = (data) =>{

    const products = joi.object({

    ProductName:joi.string().required(),
    Amount:joi.string().required(),
    Quantity:joi.string().required(),
    Barcode:joi.string().required(),
    tax:joi.string().required()

    });
    return products.validate(data);

}


module.exports = {

    productvalidation

   
 }
