const {getCart, addCart, updateCart, deleteCart} = require('./cart.schema')

const options = {
    errors: {
      wrap: {
        label: ''
      },
      abortEarly: false
    },
    
  };

module.exports = {
    getCartValidation: async(req, res, next) => {
        const value = await getCart.validate(req.query, options)
        if(value.error) {
          return  helper.sendError({},res,value.error.details[0].message)
        }
        else{
            next()
        }
    },
    addCartValidation: async(req, res, next) => {
        const value = await addCart.validate(req.body, options)
        if(value.error) {
          return  helper.sendError({},res,value.error.details[0].message)
        }
        else{
            next()
        }
    },
    updateCartValidation: async(req, res, next) => {
        let data = {...req.params, ...req.body}
        const value = await updateCart.validate(data, options)
        if(value.error) {
          return  helper.sendError({},res,value.error.details[0].message)
        }
        else{
            next()
        }
    },
    deleteCartValidation: async(req, res, next) => {
        const value = await deleteCart.validate(req.params, options)
        if(value.error) {
          return  helper.sendError({},res,value.error.details[0].message)
        }
        else{
            next()
        }
    }    
}