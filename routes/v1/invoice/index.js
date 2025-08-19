const { Router } = require("express");
const { authenticate } = require("../../../middlewares/auth");
const {
  index,
  orderInvoice,
} = require("../../../controllers/invoice/invoice.controller");
const router = Router();

router.get("/orderinvoice", index);
router.get("/orderinvoiceinfo", authenticate, orderInvoice);

module.exports = router;
