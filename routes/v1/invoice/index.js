const { Router } = require("express");
const { authenticate } = require("../../../middlewares/auth");
const {
  index,
} = require("../../../controllers/invoice/invoice.controller");
const router = Router();

router.get("/orderinvoice", index);


module.exports = router;
