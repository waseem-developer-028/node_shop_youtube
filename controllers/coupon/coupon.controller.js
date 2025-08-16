const User         = require('../../models/user')
const UserCoupon   = require('../../models/userCoupon')
const _            = require('lodash')
const moment       = require('moment')
const Coupon   = require('../../models/coupon')

const index = async(req, res) => {
    const token = req.headers['Authorization'] || req.headers['authorization'];
    
    try{
        let userId    =   await User.distinct('_id',{api_token:token})
        userId        = _.toString(userId)
        
        let data      = [];
        let coupons   = await UserCoupon.find({ user_id: helper.ObjectId(userId), used:0}).populate({path:'coupon_id',select: '_id title code description validity'})

        
        if(coupons.length > 0)
        {

            for (let key = 0; key < coupons.length; key++) {
             
                let info = coupons[key].coupon_id
                let date = 'Lifetime'
                if(info.validity!="" && info.validity !=null)
                {
                 let curDate = moment.utc().tz(req.headers['timezone']).format('YYYY-MM-DD')
                 let couponDate = moment.utc(info.validity).tz(req.headers['timezone']).format('YYYY-MM-DD')
                 date =  (couponDate > curDate) ? moment.utc(info.validity).tz(req.headers['timezone']).format('DD-MMM-YYYY') : 'Expired'
                }

                data.push({
                    title:       info.title, 
                    code:        info.code, 
                    description: info.description, 
                    amount:      coupons[key].coupon_amount, 
                    validity:    date
                });
            }
        }    
        
        return helper.sendSuccess(data, res, req.t("data_retrived"),200)

   } catch (e) {
      return helper.sendException(res, e.message, e.code)
    }
}

module.exports ={
    index
  };