const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userCouponSchema = Schema({  
  user_id: {
    type: mongoose.Schema.Types.ObjectId, ref:'User'
  },
  coupon_id: {
    type: mongoose.Schema.Types.ObjectId, ref:'Coupon'
  },
  coupon_amount: {
    type: Number,
    default:null
  },
  used:{
    type: Number,
    integer: true,
    default: 0   //1=used 0=not used
  }
},{ timestamps: true, strict:true });

module.exports = mongoose.model("User_Coupon", userCouponSchema);