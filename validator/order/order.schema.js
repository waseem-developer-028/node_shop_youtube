const joi = require("joi");
const moment = require("moment");
const Razorpay = require("razorpay");

const schema = {
  deliveryCharge: joi.object({
    total_amount: joi.number().required().max(200000),
  }),
  checkOrder: joi.object({
    user_id: joi.string().required().max(500),
  }),
  applyCoupon: joi.object({
    user_id: joi.string().required().max(500),
    coupon_code: joi.string().required().max(20),
  }),
  placeOrder: joi.object({
    user_id: joi.string().trim().required().max(500),
    payment_method: joi.string().trim().required().max(8),
    paymentId: joi.any().when("payment_method", {
      is: "coupon",
      then: joi.optional(),
      otherwise: joi.string().trim().required().min(18).max(30),
    }),
    address_id: joi.string().trim().required().max(500),
    notes: joi.string().trim().max(500),
    coupon_code: joi.any().when("payment_method", {
      is: "coupon",
      then: joi.string().required().max(12),
      otherwise: joi.optional(),
    }),
  }),

  orders: joi.object({
    user_id: joi.string().trim().required().max(500),
    status: joi.number().required().min(1).max(4),
    page: joi.number().required().min(1).max(999999999999999),
  }),
};

module.exports = schema;
