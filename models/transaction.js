const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId, ref:'User'
  },
  total_amount: {
    type: Number,
  },
  transaction_detail: {
    type: Object,
    default: null
  },
  payment_method:{
      type: String,
      trim: true,
      default: 'stripe'  //stripe/coupon
  },
  status:{
      type: String,  
      default: 'paid'
  },
}, { timestamps: true, strict:true});

module.exports = mongoose.model("Transaction", transactionSchema);