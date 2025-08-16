const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const couponSchema = Schema({  
  title: {
    type: String,
    trim: true,
    required: true,
  },
  code: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  description:{
    type: String,
    trim:true,
    required: true,
  },
  amount: {
    type: Number,
    trim:true,
    default:null
  },
  validity: {
    type: Date,
    default:null
  },
  status:{
    type: Number,
    integer:true,
    get: v => Math.round(v),
    set: v => Math.round(v),
    default:1
  }
},{ timestamps: true, strict:true});

module.exports = mongoose.model("Coupon", couponSchema);