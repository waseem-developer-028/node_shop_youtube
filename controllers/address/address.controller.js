/* global LOCALE */
const AddressModel = require('../../models/address')
const User   = require('../../models/user')

const getAddress = async (req, res) => {
  try {
       let { user_id} = req.query
       const user     = await User.findById(user_id).select('email')

       if(!user) 
         return  helper.sendError({},res,req.t('user_not_found'),200)

        const data =  await AddressModel.find({ user_id: helper.ObjectId(user_id)})

       return helper.sendSuccess(data, res, req.t("address_get"),200)
    
  } catch (e) {
    return helper.sendException(res, e.message, e.code)
  }
};

const addAddress = async (req, res) => {
    try {
      let { 
        user_id,
        address_type,
        street,
        address,
        landmark,
        city,
        state,
        zipcode
       } = req.body
       
      const user    = await User.findById(user_id).select('email')

      if(!user) 
        return  helper.sendError({},res,req.t('user_not_found'),200)
      
      
      const save = await AddressModel.create({
        user_id:user_id,
        address_type:address_type,
        street:street,
        address:address,
        landmark:landmark,
        city:city,
        state:state,
        zipcode:zipcode
      });
  
      if(!save)
         return helper.sendException(res, req.t("something_is_wrong"),200)
        
         return helper.sendSuccess({}, res, req.t("address_add"),200)
      
    } catch (e) {
      return helper.sendException(res, e.message, e.code)
    }
  };
 
  const showAddress = async (req, res) => {
    try {
      
      let { id }      = req.params
      
      const data = await AddressModel.findById(id)
        
      return helper.sendSuccess(data, res, req.t("address_show"),200)
      
    } catch (e) {
      return helper.sendException(res, e.message, e.code)
    }
  };

  const updateAddress = async (req, res) => {
    try {
      let {    
        user_id,
        address_type,
        street,
        address,
        landmark,
        city,
        state,
        zipcode
      } = req.body
      let { id }      = req.params
      
      const save = await AddressModel.findByIdAndUpdate(id,
        {    
        user_id,
        address_type,
        street,
        address,
        landmark,
        city,
        state,
        zipcode
      })
  
      if(!save)
         return helper.sendException(res, req.t("something_is_wrong"),200)
        
         return helper.sendSuccess({}, res, req.t("address_update"),200)
      
    } catch (e) {
      return helper.sendException(res, e.message, e.code)
    }
  };


  const deleteAddress = async (req, res) => {
    try {
      
      let { id }      = req.params
      
      const del       = await AddressModel.findByIdAndDelete(id)

      if(!del)
         return helper.sendException(res, req.t("something_is_wrong"),200)

      const data = await AddressModel.find({user_id:helper.ObjectId(del.user_id)})    
        
         return helper.sendSuccess(data, res, req.t("address_delete"),200)
      
    } catch (e) {
      return helper.sendException(res, e.message, e.code)
    }
  };

module.exports = {
  getAddress,
  addAddress,
  showAddress,
  updateAddress,
  deleteAddress
};
