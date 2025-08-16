/* global LOCALE */
const Subscriber   = require('../../models/subscriber')
const sendEmail = require('../../heplers/sendemail')

const addSubscriberData = async (req, res) => {
  try {
    let { email } = req.body

    const subscribe = await Subscriber.findOne({email})

    if(subscribe)
      return  helper.sendError({},res,req.t('email_taken'),200)
    /* istanbul ignore next */
    const save = await Subscriber.create({email});
    /* istanbul ignore next */
    if(!save)
       return helper.sendException(res, req.t("something_is_wrong"),200)

       
         //sending otp to user account
         /* istanbul ignore next */
         sendEmail(email,"Eyewear New Letter","subscriber.ejs")
      /* istanbul ignore next */
       return helper.sendSuccess({}, res, req.t("subcriber_data"),200)
    
  } catch (e) {
    return helper.sendException(res, e.message, e.code)
  }
};

module.exports = {
  addSubscriberData
};
