const joi = require('joi')
const { trans } = require('../../heplers/helper')
const { numbers_validation_regex, fullname_regex } = require('../../constant/common')
const helper = require('../../heplers/helper')



const schema = {
    saveContactData: joi.object({
        name: joi.string().trim().required().max(40),
        //.pattern(new RegExp("'"+fullname_regex+"'"))
        // .messages({
        //     "any.required": helper.trans("name.required"),
        //     'string.empty': helper.trans("name.empty"),
        //    // 'string.alpha' : trans("name.alpha"),
        //     'string.max'  : helper.trans("name.length")
        //   }),
        email: joi.string().trim().email().required().max(60),
        // .messages({
        //     "any.required": trans("email.required"),
        //     'string.empty': trans("email.required"),
        //     'string.email' : trans("email.email"),
        //     'string.max'  : trans("email.length")
        //   }),
          message: joi.string().trim().required().max(500),
        //   .messages({
        //     "any.required": trans("message.required"),
        //     'string.empty': trans("message.required"),
        //     'string.max'  : trans("message.length")
        //     }),  
        phone: joi.string().trim().required().pattern(new RegExp(numbers_validation_regex)).min(10).max(10)
        // .messages({
        //     "any.required": trans("phone.required"),
        //     'string.empty': trans("phone.required"),
        //     'string.pattern' : trans("phone.regex"),
        //     'string.max'  : trans("phone.length")
        //   })
    })
}

module.exports = schema