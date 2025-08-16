const { Router } = require('express')
const { add } = require('lodash')
const {getLatestProducts, products, showProduct} = require('../../../controllers/product/product.controller')
const router = Router()

router.get('/latestproducts', getLatestProducts)
router.post('/products', products)
router.get('/productdetail', showProduct)

module.exports = router;
