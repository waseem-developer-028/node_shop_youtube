const joi = require("joi");

const schema = {
  getCart: joi.object({
    user_id: joi.string().trim().required().max(500),
  }),
  addCart: joi.object({
    user_id: joi.string().trim().required().max(500),
    product_id: joi.string().trim().required().max(500),
    quantity: joi.number().required().max(20),
    size: joi.string().trim().max(2),
    color: joi.string().trim().max(20),
  }),
  updateCart: joi.object({
    id: joi.string().trim().required().max(500),
    quantity: joi.number().required().max(20),
  }),
  deleteCart: joi.object({
    id: joi.string().trim().required().max(500),
  }),
};

module.exports = schema;
