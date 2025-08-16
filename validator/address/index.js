const {getAddress, addAddress, showAddress, updateAddress, deleteAddress} = require('./address.schema')

const options = {
    errors: {
      wrap: {
        label: ''
      },
      abortEarly: false
    },
    
  };

module.exports = {
    getAddressValidation: async(req, res, next) => {
        const value = await getAddress.validate(req.query, options)
        if(value.error) {
          return  helper.sendError({},res,value.error.details[0].message)
        }
        else{
            next()
        }
    },
    addAddressValidation: async(req, res, next) => {
        const value = await addAddress.validate(req.body, options)
        if(value.error) {
          return  helper.sendError({},res,value.error.details[0].message)
        }
        else{
            next()
        }
    },
    showAddressValidation: async(req, res, next) => {
        const value = await showAddress.validate(req.params, options)
        if(value.error) {
          return  helper.sendError({},res,value.error.details[0].message)
        }
        else{
            next()
        } 
    },      
    updateAddressValidation: async(req, res, next) => {
        let data = {...req.params, ...req.body}
        const value = await updateAddress.validate(data, options)
        if(value.error) {
          return  helper.sendError({},res,value.error.details[0].message)
        }
        else{
            next()
        }
    },
    deleteAddressValidation: async(req, res, next) => {
        const value = await deleteAddress.validate(req.params, options)
        if(value.error) {
          return  helper.sendError({},res,value.error.details[0].message)
        }
        else{
            next()
        }
    }    
}