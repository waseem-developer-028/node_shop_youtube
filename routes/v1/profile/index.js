const { Router } = require("express");
const { changePasswordValidation } = require("../../../validator/profile");
const {
  saveUserImage,
  changePassword,
} = require("../../../controllers/profile/profile.controller");
const router = Router();

router.post("/uploadimage", saveUserImage);
router.post("/changepassword", changePasswordValidation, changePassword);

module.exports = router;
