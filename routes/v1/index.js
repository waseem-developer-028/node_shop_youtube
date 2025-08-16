const { Router } = require('express');
const {authenticate} = require('../../middlewares/auth')

const contactRouter = require('./contact');
const subscriberRouter = require('./subscriber');
const categoryRouter= require('./category');
const homeRouter    = require('./home');
const userRouter    = require('./user');
const productRouter = require('./product');
const cartRouter    = require('./cart');
const addressRouter = require('./address');
const orderRouter   = require('./order');
const couponRouter  = require('./coupon');
const notificationRouter  = require('./notification');
const invoiceRouter  = require('./invoice');

const router = Router();

router.use('/contact', contactRouter);
router.use('/subscribe',  subscriberRouter);
router.use('/category', categoryRouter);
router.use('/', homeRouter);
router.use('/', userRouter);
router.use('/', productRouter);
router.use('/', invoiceRouter);
router.use('/carts', authenticate, cartRouter);
router.use('/address', authenticate, addressRouter);
router.use('/', orderRouter);
router.use('/', authenticate, couponRouter);
router.use('/', authenticate, notificationRouter);


module.exports = router;
