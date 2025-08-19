const { size } = require("lodash");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
      integer: true,
      get: (v) => Math.round(v),
      set: (v) => Math.round(v),
      required: true,
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

cartSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

cartSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Cart", cartSchema);
