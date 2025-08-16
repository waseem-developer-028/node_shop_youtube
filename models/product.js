const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const productSchema = Schema({
  image: {
    type: String,
    trim: true,
    required: true,
  },
  name: {
    type: String,
    trim:true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, ref:'Category'
  },
  information: {
    type: String,
    trim:true,
    required: true,
  },
  qty:{
   type: Number,
   integer: true,
   get: v => Math.round(v),
   set: v => Math.round(v),
   required: true
  },
  status: {
    type: Number,
    integer:true,
    get: v => Math.round(v),
    set: v => Math.round(v),
    default:1
  }
}, { timestamps: true, strict:true});

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Product", productSchema);