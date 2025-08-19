/* global LOCALE */
const Contact = require("../../models/contact");
const striptags = require("striptags");

const addContactData = async (req, res) => {
  try {
    let { name, email, phone, message } = req.body;
    message = striptags(message);

    const save = await Contact.create({
      name: name,
      phone: phone,
      email: email,
      message: message,
    });

    if (!save)
      return helper.sendException(res, req.t("something_is_wrong"), 200);

    return helper.sendSuccess({}, res, req.t("contact_save_data"), 200);
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

module.exports = {
  addContactData,
};
