
const joi = require("joi");

const salesValidation = (data) => {

const sales = joi.object().keys({

    customer_Id:joi.string().required(),
    customerName:joi.string().required(),
    CustomerPhone:joi.string().required(),
    CustomerEmail:joi.string().required(),
    CustomerAddress:joi.string().required(),
    ProductDetails:joi.required(),
    GrandTotal:joi.number().required(),
    TaxProductTotal:joi.number().required(),
    TaxGrandTotal:joi.number().required()


});

return sales.validate(data);

}


module.exports = {

    salesValidation
}