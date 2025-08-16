const joi = require('joi')



const schema = {
    getAddress: joi.object({
        user_id: joi.string().trim().required().max(500),
    }), 
    addAddress: joi.object({
        id: joi.string().allow(null).max(40),
        user_id: joi.string().trim().required().max(500),
        street: joi.string().trim().required().max(20), 
        address_type: joi.string().trim().required().max(20), 
        address: joi.string().trim().required().max(40), 
        landmark: joi.string().trim().required().max(40), 
        state: joi.string().trim().required().max(20), 
        city: joi.string().trim().required().max(20), 
        zipcode:joi.number().required().max(999999)
    }),
    showAddress: joi.object({
        id: joi.string().trim().required().max(500),
    }),  
    updateAddress: joi.object({
        id: joi.any().required(),
        user_id: joi.string().trim().required().max(500),
        street: joi.string().trim().required().max(20), 
        address_type: joi.string().trim().required().max(20), 
        address: joi.string().trim().required().max(40), 
        landmark: joi.string().trim().required().max(40), 
        state: joi.string().trim().required().max(20), 
        city: joi.string().trim().required().max(20), 
        zipcode:joi.number().required().max(999999)
    }), 
    deleteAddress: joi.object({
        id: joi.string().trim().required().max(500),
    }), 

}

module.exports = schema