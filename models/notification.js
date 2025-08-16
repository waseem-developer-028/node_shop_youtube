const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const notificationSchema = Schema({
 user_id: {
     type: mongoose.Schema.Types.ObjectId, ref:'User'
      },  
  title: {
    type: String,
    trim:true,
    required: true,
  },
  body: {
    type: String,
    trim:true,
    required: true,
  },
  read_at: {
    type: Date,
    default:null
  },
},{ timestamps: true, strict:true });

notificationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Notification", notificationSchema);