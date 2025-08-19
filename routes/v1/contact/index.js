const { Router } = require("express");
const { addContactValidation } = require("../../../validator/contact");
const {
  addContactData,
} = require("../../../controllers/contact/contact.controller");
const router = Router();

router.post("/", addContactValidation, addContactData);

module.exports = router;
