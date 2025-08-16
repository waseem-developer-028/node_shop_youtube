const { Router } = require('express')
const {getCartValidation, addCartValidation, updateCartValidation, deleteCartValidation} = require('../../../validator/cart')
const {getCart, addCart, updateCart, deleteCart} = require('../../../controllers/cart/cart.controller')
const router = Router()

router.get('/',getCartValidation, getCart)
router.post('/',addCartValidation, addCart)
router.put('/:id',updateCartValidation, updateCart)
router.delete('/:id',deleteCartValidation, deleteCart)

module.exports = router;
