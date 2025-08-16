const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = Schema({
 user_id: {
     type: mongoose.Schema.Types.ObjectId, ref:'User'
      },  
  address_type: {
    type: String,
    trim:true,
    required: true,
  },
  street: {
    type: String,
    trim:true,
    required: true,
  },
  address: {
    type: String,
    trim:true,
    required: true,
  },
  city: {
    type: String,
    trim:true,
    required: true,
  },
  state: {
    type: String,
    trim:true,
    required: true,
  },
  zipcode: {
    type: Number,
    integer: true,
    get: v => Math.round(v),
    set: v => Math.round(v),
    required: true,
  },
  landmark: {
    type: String,
    trim:true,
    required: true,
  },
  country: {
    type: String,
    default: "India",
  }
},{ timestamps: true, strict:true});

addressSchema.virtual('id').get(function(){
  return this._id.toHexString();
})

addressSchema.set("toJSON",{
  virtuals:true
})

module.exports = mongoose.model("Address", addressSchema);