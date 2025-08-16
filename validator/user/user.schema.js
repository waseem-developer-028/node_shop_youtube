const joi = require('joi')
const {PASSWORD:{MIN,MAX}} = require('../../constant/common')


const schema = {
    registerData: joi.object({
        name: joi.string().trim().required().max(40),
        email: joi.string().trim().email().required().max(60), 
        password: joi.string().trim().required().min(MIN).max(MAX)
    }), 

    otpData: joi.object({
        email: joi.string().trim().email().required().max(60),
    }),
    verifyotpData: joi.object({
        email: joi.string().trim().email().required().max(60),
        otp:joi.number()
        .integer()
        .required()
        .min(111111)
        .max(999999)
    }),
    loginData: joi.object({
        email: joi.string().trim().email().required().max(60), 
        password: joi.string().trim().required().min(MIN).max(MAX),
       
    }),
    socialData: joi.object({
        social_id: joi.string().trim().required().max(300),
        email: joi.string().trim().allow(null).email().max(60), 
        name: joi.string().allow(null).max(40),
        login_type:joi.number().max(1)
    }),

    forgotPasswordData: joi.object({
        email: joi.string().trim().email().required().max(60),
    }),
    refreshTokenData: joi.object({
        user_id: joi.string().trim().required().max(500),
    }),
}

module.exports = schema