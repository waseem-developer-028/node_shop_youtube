const { Router } = require("express");
const {
  getAddressValidation,
  addAddressValidation,
  showAddressValidation,
  updateAddressValidation,
  deleteAddressValidation,
} = require("../../../validator/address");
const {
  getAddress,
  addAddress,
  showAddress,
  updateAddress,
  deleteAddress,
} = require("../../../controllers/address/address.controller");
const router = Router();

router.get("/", getAddressValidation, getAddress);
router.post("/add", addAddressValidation, addAddress);
router.get("/:id", showAddressValidation, showAddress);
router.put("/:id", updateAddressValidation, updateAddress);
router.delete("/:id", deleteAddressValidation, deleteAddress);

module.exports = router;
