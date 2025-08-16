const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productRatingSchema = Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId, ref:'Product'
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId, ref:'User'
  },
  rating: {
    type: Number,
    integer: true,
    get: v => Math.round(v),
    set: v => Math.round(v)
  },
  comment: {
    type: String,
    trim:true
  },
  status:{
      type: Number,
      integer: true,
      get: v => Math.round(v),
      set: v => Math.round(v),
      default: 1
  }
}, { timestamps: true, strict:true});

module.exports = mongoose.model("Product_Rating", productRatingSchema);