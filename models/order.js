const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = Schema(
  {
    order_id: {
      type: String,
      trim: true,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    stripe_session_id: {
      type: String,
      trim: true,
      default: ''
    },
    transaction_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
    transaction_detail: {
      type: Object,
      default: null,
    },
    address_detail: {
      type: Object,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: null,
    },
    rated: {
      type: Number,
      integer: true,
      get: (v) => Math.round(v),
      set: (v) => Math.round(v),
      default: 1, //1=rated, 0=not rated
    },
    delivery_charge: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      integer: true,
      get: (v) => Math.round(v),
      set: (v) => Math.round(v),
      default: 1, //1=confirmed, 2=shipped, 3=delivered
    },
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model("Order", orderSchema);
