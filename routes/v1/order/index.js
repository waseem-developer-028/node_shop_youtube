const { Router } = require("express");
const {
  deliveryChargeValidation,
  checkOrderValidation,
  applyCouponValidation,
  placeOrderValidation,
  ordersValidation,
} = require("../../../validator/order");
const {
  getDeliveryCharge,
  getCheckoutInfo,
  checkOrder,
  applyCoupon,
  placeOrder,
  orders,
  stripeSuccess,
  stripeCancel,
} = require("../../../controllers/order/order.controller");
const { authenticate } = require("../../../middlewares/auth");
const router = Router();

router.post(
  "/deliverycharge",
  authenticate,
  deliveryChargeValidation,
  getDeliveryCharge
);
router.get("/getcheckoutinfo", authenticate, getCheckoutInfo);
router.post("/checkorder", authenticate, checkOrderValidation, checkOrder);
router.post("/applycoupon", authenticate, applyCouponValidation, applyCoupon);
router.post("/placeorder", authenticate, placeOrderValidation, placeOrder);
router.get("/orders", authenticate, ordersValidation, orders);
router.get("/stripe/success", stripeSuccess);
router.get("/stripe/cancel", stripeCancel);

module.exports = router;
