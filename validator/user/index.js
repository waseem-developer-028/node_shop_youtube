const {registerData, otpData, verifyotpData, loginData, socialData, forgotPasswordData, refreshTokenData} = require('./user.schema')

const options = {
    errors: {
      wrap: {
        label: ''
      },
      abortEarly: false
    },
    
  };

module.exports = {
    registerValidation: async(req, res, next) => {
        const value = await registerData.validate(req.body, options)
        if(value.error) {
          return  helper.sendError({},res,value.error.details[0].message)
        }
        else{
            next()
        }
    },
  otpValidation: async(req, res, next) => {
      const value = await otpData.validate(req.body, options)
      if(value.error) {
        return  helper.sendError({},res,value.error.details[0].message)
      }
      else{
          next()
      }
  },

  verifyotpValidation: async(req, res, next) => {
    const value = await verifyotpData.validate(req.body, options)
    if(value.error) {
      return  helper.sendError({},res,value.error.details[0].message)
    }
    else{
        next()
    }
},

loginValidation: async(req, res, next) => {
  const value = await loginData.validate(req.body, options)
  if(value.error) {
    return  helper.sendError({},res,value.error.details[0].message)
  }
  else{
      next()
  }
},

socialLoginValidation: async(req, res, next) => {
  const value = await socialData.validate(req.body, options)
  if(value.error) {
    return  helper.sendError({},res,value.error.details[0].message)
  }
  else{
      next()
  }
},

 forgotPasswordValidation: async(req, res, next) => {
  const value = await forgotPasswordData.validate(req.body, options)
  if(value.error) {
    return  helper.sendError({},res,value.error.details[0].message)
  }
  else{
      next()
  }
},

refreshTokenValidation: async(req, res, next) => {
  const value = await refreshTokenData.validate(req.body, options)
  if(value.error) {
    return  helper.sendError({},res,value.error.details[0].message)
  }
  else{
      next()
  }
}

}