const { deliveryCharge, checkOrder, applyCoupon, placeOrder, orders } = require('./order.schema')

const options = {
    errors: {
      wrap: {
        label: ''
      },
      abortEarly: false
    },
    
  };

module.exports = {
   deliveryChargeValidation: async(req, res, next) => {
        const value = await deliveryCharge.validate(req.body, options)
        if(value.error) {
          return  helper.sendError({},res,value.error.details[0].message)
        }
        else{
            next()
        }
    },
  
    checkOrderValidation: async(req, res, next) => {
      const value = await checkOrder.validate(req.body, options)
      if(value.error) {
        return  helper.sendError({},res,value.error.details[0].message)
      }
      else{
          next()
      }
  },

  applyCouponValidation: async(req, res, next) => {
    const value = await applyCoupon.validate(req.body, options)
    if(value.error) {
      return  helper.sendError({},res,value.error.details[0].message)
    }
    else{
        next()
    }
},

placeOrderValidation: async(req, res, next) => {
  const value = await placeOrder.validate(req.body, options)
  if(value.error) {
    return  helper.sendError({},res,value.error.details[0].message)
  }
  else{
      next()
  }
},

ordersValidation: async(req, res, next) => {
  const value = await orders.validate(req.query,options)
  if(value.error) {
    return  helper.sendError({},res,value.error.details[0].message)
  }
  else{
      next()
  }
}

}