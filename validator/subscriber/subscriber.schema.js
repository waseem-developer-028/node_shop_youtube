const joi = require('joi')

const schema = {
    saveSubscriberData: joi.object({
        email: joi.string().trim().email().required().max(60)
    })
}

module.exports = schema