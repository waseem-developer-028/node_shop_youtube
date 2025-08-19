const { Router } = require("express");
const { index } = require("../../../controllers/coupon/coupon.controller");
const router = Router();

router.get("/coupons", index);

module.exports = router;
