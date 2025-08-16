const {saveSubscriberData} = require('./subscriber.schema')

const options = {
    errors: {
      wrap: {
        label: ''
      },
      abortEarly: false
    },
    
  };

module.exports = {
    addSubscriberValidation: async(req, res, next) => {
        const value = await saveSubscriberData.validate(req.body, options)
        if(value.error) {
          return  helper.sendError({},res,value.error.details[0].message)
        }
        else{
            next()
        }
    }
}