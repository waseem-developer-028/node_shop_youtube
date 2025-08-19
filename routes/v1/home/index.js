const { Router } = require("express");
const {
  getHomeProducts,
  topRatedProducts,
} = require("../../../controllers/home/home.controller");
const router = Router();

router.get("/homeproducts", getHomeProducts);
router.get("/topratedproducts", topRatedProducts);

module.exports = router;
