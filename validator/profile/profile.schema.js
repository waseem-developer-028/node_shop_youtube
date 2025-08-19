const joi = require("joi");
const {
  PASSWORD: { MIN, MAX },
} = require("../../constant/common");

const schema = {
  changePassword: joi.object({
    current_password: joi
      .string()
      .trim()
      .required()
      .min(MIN)
      .max(MAX)
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\D)(?=.*?[#?!@$%^&*-]).{8,}$/)
      .messages({
        "string.pattern.base":
          "Must contain minimum 8 characters, at least one upper case letter, one number and one special character",
      }),
    new_password: joi
      .string()
      .trim()
      .required()
      .min(MIN)
      .max(MAX)
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\D)(?=.*?[#?!@$%^&*-]).{8,}$/)
      .messages({
        "string.pattern.base":
          "Must contain minimum 8 characters, at least one upper case letter, one number and one special character",
      }),
    confirm_password: joi
      .string()
      .trim()
      .equal(joi.ref("new_password"))
      .required()
      .min(MIN)
      .max(MAX)
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\D)(?=.*?[#?!@$%^&*-]).{8,}$/)
      .messages({
        "string.pattern.base":
          "Must contain minimum 8 characters, at least one upper case letter, one number and one special character",
        "any.only": "Confirm password must match the new password",
      }),
  }),
};

module.exports = schema;
