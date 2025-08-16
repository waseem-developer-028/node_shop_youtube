const joi      = require('joi')
const moment = require('moment')


const schema = {
    deliveryCharge: joi.object({
        total_amount:joi.number().required().max(200000)
    }), 
    checkOrder: joi.object({
        user_id:joi.string().required().max(500)
    }), 
    applyCoupon: joi.object({
        user_id:joi.string().required().max(500),
        coupon_code:joi.string().required().max(20),
    }), 
    placeOrder: joi.object({
        user_id:joi.string().trim().required().max(500),
        payment_method:joi.string().trim().required().max(6),
        address_id:joi.string().trim().required().max(500),
        notes:joi.string().trim().max(500),
        coupon_code: joi.any().when('payment_method', { is: 'coupon', then: joi.string().required().max(12), otherwise: joi.optional() }),
        name: joi.string().trim().when('payment_method', { is: 'stripe', then: joi.string().required().max(50), otherwise: joi.optional() }),
        card: joi.any().when('payment_method', { is: 'stripe', then: joi.number().integer().required().min(100000)
        .max(9999999999999999), otherwise: joi.optional() }),
        month: joi.any().when('payment_method', { is: 'stripe', then: joi.number().integer().required().min(1).max(12), otherwise: joi.optional() }),
        cvv: joi.any().when('payment_method', { is: 'stripe', then: joi.number().integer().required().min(100)
        .max(9999), otherwise: joi.optional() }),
        year: joi.any().when('payment_method', { is: 'stripe', then: joi.number().integer().required().min(parseInt(moment().year()))
        .max(99999), otherwise: joi.optional() })

    }),

    orders: joi.object({
        user_id: joi.string().trim().required().max(500),
        status:joi.number().required().min(1).max(3),
        page:joi.number().required().min(1).max(999999999999999)
    })
}

module.exports = schema