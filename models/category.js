const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = Schema({
  name: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  status: {
    type: Number,
    integer:true,
    get: v => Math.round(v),
    set: v => Math.round(v),
    default:1
  },
},{ timestamps: true, strict:true });

module.exports = mongoose.model("Category", categorySchema);