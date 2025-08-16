const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriberSchema = Schema({
  email: {
    type: String,
    trim:true,
    required: true,
  },
  status: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    default: 1,
  },
},{ timestamps: true, strict:true });

module.exports = mongoose.model("Subscriber", subscriberSchema);