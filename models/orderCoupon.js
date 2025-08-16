const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderCouponSchema = Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId, ref:'User'
  },
  user_coupon_id: {
    type: mongoose.Schema.Types.ObjectId, ref:'User_Coupon'
  },
  order_id: {
    type: mongoose.Schema.Types.ObjectId, ref:'Order'
  },
  
}, { timestamps: true, strict:true});

module.exports = mongoose.model("Order_Coupon", orderCouponSchema);