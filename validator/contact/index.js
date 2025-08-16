const {saveContactData} = require('./contact.schema')

const options = {
    errors: {
      wrap: {
        label: ''
      },
      abortEarly: false
    },
    
  };

module.exports = {
    addContactValidation: async(req, res, next) => {
        const value = await saveContactData.validate(req.body, options)
        if(value.error) {
          return  helper.sendError({},res,value.error.details[0].message)
        }
        else{
            next()
        }
    }
}