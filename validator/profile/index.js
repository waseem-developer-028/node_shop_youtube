const { changePassword } = require("./profile.schema");

const options = {
  errors: {
    wrap: {
      label: "",
    },
    abortEarly: false,
  },
};

module.exports = {
  changePasswordValidation: async (req, res, next) => {
    const value = await changePassword.validate(req.body, options);
    if (value.error) {
      return helper.sendError({}, res, value.error.details[0].message);
    } else {
      next();
    }
  },
};
