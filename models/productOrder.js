const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productOrderSchema = Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      integer: true,
      get: (v) => Math.round(v),
      set: (v) => Math.round(v),
      default: 1,
    },
    size: {
      type: String,
      default: "M",
    },
    color: {
      type: String,
      default: "#B11D1D",
    },
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model("Product_Order", productOrderSchema);
