const _ = require("lodash");
const stripe = require("stripe")(process.env.STRIPE_SK);
const Cart = require("../../models/cart");
const Address = require("../../models/address");
const UserCoupon = require("../../models/userCoupon");
const Coupon = require("../../models/coupon");
const Order = require("../../models/order");
const OrderCoupon = require("../../models/orderCoupon");
const Transaction = require("../../models/transaction");
const ProductOrder = require("../../models/productOrder");
const Product = require("../../models/product");
const moment = require("moment");
const striptags = require("striptags");
const hepler = require("../../heplers/helper");

const getDeliveryCharge = (req, res) => {
  try {
    const { total_amount } = req.body;
    const delivery_charge = helper.deliveryFee(total_amount);
    return helper.sendSuccess(
      delivery_charge,
      res,
      req.t("data_retrived"),
      200
    );
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

const getCheckoutInfo = async (req, res) => {
  try {
    const { user_id } = req.query;
    const data = {};
    if (_.isEmpty(user_id) || !helper.ObjectId.isValid(user_id)) {
      return helper.sendError({}, res, req.t("user_not_found"), 200);
    }

    data["coupon"] = [];
    data["cart"] = await Cart.aggregate([
      {
        $match: { user_id: helper.ObjectId(user_id) },
      },
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          id: "$_id",
          _id: 0,
          image: "$product.image",
          name: "$product.name",
          price: "$product.price",
          user_id: 1,
          product_id: 1,
          quantity: 1,
        },
      },
    ]);
    data["address"] = await Address.find({
      user_id: helper.ObjectId(user_id),
    }).sort({ createdAt: -1 });

    let coupons = await UserCoupon.find({
      user_id: helper.ObjectId(user_id),
      used: 0,
    }).populate({
      path: "coupon_id",
      select: "_id title code description validity",
    });

    if (coupons.length > 0) {
      for (let key = 0; key < coupons.length; key++) {
        let info = coupons[key].coupon_id;
        let date = "Lifetime";
        if (info.validity != "" && info.validity != null) {
          let curDate = moment
            .utc()
            .tz(req.headers["timezone"])
            .format("YYYY-MM-DD");
          let couponDate = moment
            .utc(info.validity)
            .tz(req.headers["timezone"])
            .format("YYYY-MM-DD");
          date =
            couponDate > curDate
              ? moment
                  .utc(info.validity)
                  .tz(req.headers["timezone"])
                  .format("DD-MMM-YYYY")
              : "Expired";
        }

        data["coupon"].push({
          title: info.title,
          code: info.code,
          description: info.description,
          amount: coupons[key].coupon_amount,
          validity: date,
        });
      }
    }

    return helper.sendSuccess(data, res, req.t("data_retrived"), 200);
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

const checkOrder = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (_.isEmpty(user_id) || !helper.ObjectId.isValid(user_id)) {
      return helper.sendError({}, res, req.t("user_not_found"), 200);
    }

    const cart = await Cart.find(
      { user_id: helper.ObjectId(user_id) },
      { id: 1, user_id: 1, quantity: 1 }
    )
      .populate({ path: "product_id", select: "_id qty name price status" })
      .sort({ createdAt: -1 });

    if (cart.length < 1)
      return helper.sendError({}, res, req.t("cart_no_items"), 200);

    for (let row of cart) {
      if (row.product_id.status !== 1)
        return helper.sendError(
          {},
          res,
          row.product_id.name + "" + req.t("order_product_status"),
          200
        );
      else if (row.quantity > 20)
        return helper.sendError(
          {},
          res,
          row.product_id.name + "" + req.t("order_qty_limit"),
          200
        );
      else if (row.product_id.qty === 0)
        return helper.sendError(
          {},
          res,
          row.product_id.name + "" + req.t("order_out_of_stock"),
          200
        );
      else if (row.quantity > row.product_id.qty)
        return helper.sendError(
          {},
          res,
          row.product_id.name +
            "" +
            req.t("order_available_qty") +
            "" +
            row.product_id.qty,
          200
        );
    }

    return helper.sendSuccess({}, res, req.t("order_checkout"), 200);
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

const checkCoupon = async (req, res) => {
  const { user_id, coupon_code } = req.body;

  const couponInfo = await Coupon.findOne(
    { code: coupon_code },
    { _id: 1, validity: 1, status: 1, code: 1 }
  );

  if (!couponInfo) return req.t("coupon_invalid");

  const userCouponInfo = UserCoupon.findOne({
    user_id: helper.ObjectId(user_id),
    coupon_id: helper.ObjectId(couponInfo._id),
  });

  if (couponInfo.status != 1) {
    return req.t("coupon_deactivated");
  } else if (!userCouponInfo) {
    return req.t("coupon_invalid");
  } else if (couponInfo.validity != "" && couponInfo.validity != null) {
    let curDate = moment.utc().tz(req.headers["timezone"]).format("YYYY-MM-DD");
    let couponDate = moment
      .utc(couponInfo.validity)
      .tz(req.headers["timezone"])
      .format("YYYY-MM-DD");
    if (couponDate < curDate) return req.t("coupon_expired");
  }

  return 1;
};

const applyCoupon = async (req, res) => {
  const check = await checkCoupon(req, res);

  if (check == 1)
    return helper.sendSuccess({}, res, req.t("coupon_applied"), 200);
  else return helper.sendError({}, res, check, 200);
};

const insertCouponLog = (data) => {
  const { user_id, id, order_id } = data;

  UserCoupon.findByIdAndUpdate(
    id,
    {
      used: 1,
    },
    { new: true }
  )
    .then((couponUsed) => {})
    .catch((err) => {});

  OrderCoupon.create({
    user_id: user_id,
    user_coupon_id: id,
    order_id: order_id,
  })
    .then((coupon) => {})
    .catch((err) => {});
};

const insertTransaction = async (data) => {
  const { user_id, total_amount, payment_method, status } = data;

  const save = await Transaction.create({
    user_id: user_id,
    total_amount: total_amount,
    payment_method: payment_method,
    status: status,
  });

  return save._id;
};

const insertOrder = async (data) => {
  const {
    user_id,
    transaction_id,
    transaction_detail,
    payment_method,
    notes,
    address_id,
    delivery_charge,
    stripe_session_id,
  } = data;

  const addressInfo = await Address.findById(address_id);

  const orderInfo = await Order.create({
    order_id: "EY" + helper.rand(12345678, 99999999),
    user_id: user_id,
    transaction_id: transaction_id,
    transaction_detail: transaction_detail,
    address_detail: addressInfo,
    notes: striptags(notes),
    delivery_charge: delivery_charge,
    stripe_session_id: stripe_session_id,
    status: 1,
  });

  const cart = await Cart.find(
    { user_id: helper.ObjectId(user_id) },
    { id: 1, user_id: 1, quantity: 1 }
  )
    .populate({ path: "product_id", select: "_id qty name price status" })
    .sort({ createdAt: -1 });

  if (cart.length > 0) {
    for (let row of cart) {
      let qty = parseInt(row.quantity);
      await ProductOrder.create({
        order_id: orderInfo._id,
        product_id: row.product_id._id,
        price: row.product_id.price,
        quantity: qty,
      });

      await Product.findByIdAndUpdate(row.product_id._id, {
        $inc: { qty: -qty },
      });
    } //for loop close

    Cart.deleteMany({ user_id: helper.ObjectId(user_id) })
      .then((cartInfo) => {})
      .catch((err) => {});
  }
  return orderInfo;
};

const couponCheckout = async (req, res) => {
  try {
    const userCart = await Cart.find(
      { user_id: helper.ObjectId(req.body.user_id) },
      { id: 1, user_id: 1, quantity: 1 }
    )
      .populate({ path: "product_id", select: "_id qty name price status" })
      .sort({ createdAt: -1 });

    let subTotal = 0;

    userCart.map(
      (row, inx) => (subTotal += +row.product_id.price * +row.quantity)
    );
    let deliveryCharge = parseFloat(helper.deliveryFee(subTotal));
    let total = subTotal + deliveryCharge;
    total = parseFloat(total).toFixed(2);
    let couponAmount = 0;
    let userCouponInfo = null;
    let couponInfo = null;

    if (!_.isEmpty(req.body.coupon_code)) {
      const check = await checkCoupon(req, res);

      if (check == 1) {
        couponInfo = await Coupon.findOne(
          { code: req.body.coupon_code },
          { _id: 1, validity: 1, status: 1, code: 1 }
        );

        userCouponInfo = await UserCoupon.findOne({
          user_id: helper.ObjectId(req.body.user_id),
          coupon_id: helper.ObjectId(couponInfo._id),
        });
      } else {
        return helper.sendError({}, res, check, 200);
      }
    }

    const transactionData = {
      user_id: req.body.user_id,
      total_amount: total,
      payment_method: req.body.payment_method,
      status: "paid",
    };

    const transaction_id = await insertTransaction(transactionData);

    const orderData = {
      user_id: req.body.user_id,
      transaction_id: transaction_id,
      transaction_detail: {
        payment_type: "coupon",
      },
      payment_method: req.body.payment_method,
      notes: req.body.notes,
      address_id: req.body.address_id,
      delivery_charge: deliveryCharge,
    };

    const order = await insertOrder(orderData);

    const couponData = {
      user_id: req.body.user_id,
      id: userCouponInfo._id,
      order_id: order._id,
    };
    insertCouponLog(couponData);

    return order;
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

// const stripeCheckout = async (req, res) => {
//   try {
//     const userCart = await Cart.find(
//       { user_id: helper.ObjectId(req.body.user_id) },
//       { id: 1, user_id: 1, quantity: 1 }
//     )
//       .populate({ path: "product_id", select: "_id qty name price status" })
//       .sort({ createdAt: -1 });

//     let subTotal = 0;

//     userCart.map(
//       (row, inx) => (subTotal += +row.product_id.price * +row.quantity)
//     );
//     let deliveryCharge = parseFloat(helper.deliveryFee(subTotal));
//     let total = subTotal + deliveryCharge;

//     let couponAmount = 0;
//     let userCouponInfo = null;
//     let couponInfo = null;

//     if (!_.isEmpty(req.body.coupon_code)) {
//       const check = await checkCoupon(req, res);

//       if (check == 1) {
//         couponInfo = await Coupon.findOne(
//           { code: req.body.coupon_code },
//           { _id: 1, validity: 1, status: 1, code: 1 }
//         );

//         userCouponInfo = await UserCoupon.findOne({
//           user_id: helper.ObjectId(req.body.user_id),
//           coupon_id: helper.ObjectId(couponInfo._id),
//         });
//         total = total - userCouponInfo.coupon_amount;
//       } else {
//         return helper.sendError({}, res, check, 200);
//       }
//     }

//     total = parseFloat(total).toFixed(2);

//     if (total < 50) {
//       return helper.sendError({}, res, req.t("minimum_order_value"), 200);
//     }

//     // const token = await stripe.tokens.create({
//     //   card: {
//     //     number: req.body.card,
//     //     exp_month: req.body.month,
//     //     exp_year: req.body.year,
//     //     cvc: req.body.cvv,
//     //   },
//     // });

//     const addressInfo = await Address.findById(req.body.address_id);
//     let description = `Order placed with user id ${req.body.user_id} Address: ${addressInfo.street}, ${addressInfo.address}, ${addressInfo.city}, ${addressInfo.state}, ${addressInfo.zipcode}`;

//     // const charge = await stripe.charges.create({
//     //   'amount': total * 100,
//     //   'currency': 'inr',
//     //   'source': token.id,
//     //   'description': description
//     // });

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: userCart.map((item) => ({
//         price_data: {
//           currency: "inr",
//           product_data: { name: item.product_id.name },
//           unit_amount: Math.round(item.product_id.price * 100),
//         },
//         quantity: item.quantity,
//       })),
//       shipping_options: [
//         {
//           shipping_rate_data: {
//             display_name: "Delivery",
//             type: "fixed_amount",
//             fixed_amount: {
//               amount: Math.round(deliveryCharge * 100),
//               currency: "inr",
//             },
//           },
//         },
//       ],
//       success_url: `http://localhost:3000/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `http://localhost:3000/stripe/cancel`,
//       metadata: {
//         user_id: req.body.user_id,
//         address_id: req.body.address_id,
//         notes: req.body.notes || "",
//         delivery_charge: deliveryCharge,
//       },
//     });

//   return hepler.sendSuccess({sessionUrl: session.url}, res, 'success', 200)
//     // if (charge.status == "succeeded") {
//     //   const transactionData = {
//     //     user_id: req.body.user_id,
//     //     total_amount: total,
//     //     payment_method: req.body.payment_method,
//     //     status: "paid"
//     //   }

//     //   const transaction_id = await insertTransaction(transactionData)

//     //   const orderData = {
//     //     user_id: req.body.user_id,
//     //     transaction_id: transaction_id,
//     //     transaction_detail: charge,
//     //     payment_method: req.body.payment_method,
//     //     notes: req.body.notes,
//     //     address_id: req.body.address_id,
//     //     delivery_charge: deliveryCharge
//     //   }

//     //   const order = await insertOrder(orderData)

//     //   if (!_.isEmpty(req.body.coupon_code)) {
//     //     const couponData = {
//     //       user_id: req.body.user_id,
//     //       id: userCouponInfo._id,
//     //       order_id: order._id
//     //     }
//     //     insertCouponLog(couponData)
//     //   }

//     //   return order
//     // }
//   } catch (e) {
//     return helper.sendException(res, e.message, e.code);
//   }
// };

const stripeSuccess = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) {
      return helper.sendError({}, res, "Missing session_id", 400);
    }

    const existingOrder = await Order.findOne({
      stripe_session_id: session_id,
    });
    if (existingOrder) {
      return res.redirect(
        `${process.env.WEB_URL}/order?order_id=${existingOrder._id}&ex=true`
      );
    }

    // Retrieve the session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Only create order if payment is successful
    if (session.payment_status === "paid") {
      const transactionData = {
        user_id: session.metadata.user_id,
        total_amount: session.amount_total / 100,
        payment_method: "stripe",
        status: "paid",
      };

      const transaction_id = await insertTransaction(transactionData);

      const orderData = {
        user_id: session.metadata.user_id,
        transaction_id,
        transaction_detail: session,
        payment_method: "stripe",
        notes: session.metadata.notes,
        address_id: session.metadata.address_id,
        delivery_charge: parseFloat(session.metadata.delivery_charge),
        stripe_session_id: session_id,
      };

      const order = await insertOrder(orderData);

      // Optional: log coupon usage
      if (session.metadata.coupon_id) {
        await insertCouponLog({
          user_id: session.metadata.user_id,
          id: session.metadata.coupon_id,
          order_id: order._id,
        });
      }

      let status = helper.orderStatus(order.status);
      status = req.t(status);

      helper.sendNotification(
        session.metadata.user_id,
        req.t("order_confirmed"),
        `${req.t("your_order")} ${order.order_id} ${req.t("is_now")} ${status}`
      );

      // Redirect to a confirmation page in your frontend
      return res.redirect(`${session.metadata.web_url}?order_id=${order._id}`);
    } else {
      return res.redirect(`${session.metadata.web_url}?error=payment_failed`);
    }
  } catch (e) {
    return helper.sendError({}, res, e.message, 500);
  }
};

const stripeCancel = async (req, res) => {};

const placeOrder = async (req, res) => {
  try {
    const userCart = await Cart.find(
      { user_id: helper.ObjectId(req.body.user_id) },
      { id: 1, user_id: 1, quantity: 1 }
    )
      .populate({ path: "product_id", select: "_id qty name price status" })
      .sort({ createdAt: -1 });

    let subTotal = 0;

    userCart.map(
      (row, inx) => (subTotal += +row.product_id.price * +row.quantity)
    );
    let deliveryCharge = parseFloat(helper.deliveryFee(subTotal));
    let total = subTotal + deliveryCharge;

    let couponAmount = 0;
    let userCouponInfo = null;
    let couponInfo = null;

    if (!_.isEmpty(req.body.coupon_code)) {
      const check = await checkCoupon(req, res);

      if (check == 1) {
        couponInfo = await Coupon.findOne(
          { code: req.body.coupon_code },
          { _id: 1, validity: 1, status: 1, code: 1 }
        );

        userCouponInfo = await UserCoupon.findOne({
          user_id: helper.ObjectId(req.body.user_id),
          coupon_id: helper.ObjectId(couponInfo._id),
        });
        total = total - userCouponInfo.coupon_amount;
      } else {
        return helper.sendError({}, res, check, 200);
      }
    }

    total = parseFloat(total).toFixed(2);

    if (total < 50) {
      return helper.sendError({}, res, req.t("minimum_order_value"), 200);
    }

    // const token = await stripe.tokens.create({
    //   card: {
    //     number: req.body.card,
    //     exp_month: req.body.month,
    //     exp_year: req.body.year,
    //     cvc: req.body.cvv,
    //   },
    // });

    const addressInfo = await Address.findById(req.body.address_id);
    let description = `Order placed with user id ${req.body.user_id} Address: ${addressInfo.street}, ${addressInfo.address}, ${addressInfo.city}, ${addressInfo.state}, ${addressInfo.zipcode}`;

    // const charge = await stripe.charges.create({
    //   'amount': total * 100,
    //   'currency': 'inr',
    //   'source': token.id,
    //   'description': description
    // });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: userCart.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: { name: item.product_id.name },
          unit_amount: Math.round(item.product_id.price * 100),
        },
        quantity: item.quantity,
      })),
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "Delivery",
            type: "fixed_amount",
            fixed_amount: {
              amount: Math.round(deliveryCharge * 100),
              currency: "inr",
            },
          },
        },
      ],
      success_url: `${process.env.APP_URL}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/stripe/cancel`,
      metadata: {
        user_id: req.body.user_id,
        address_id: req.body.address_id,
        notes: req.body.notes || "",
        delivery_charge: deliveryCharge,
        web_url: req.body.web_url || "",
      },
      payment_intent_data: {
        description: description,
      },
    });

    return hepler.sendSuccess(
      { sessionUrl: session.url, id: session.id },
      res,
      "success",
      200
    );
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

const orders = async (req, res) => {
  try {
    const { page = 1, user_id, status } = req.query;
    const { offset, limit } = helper.paginate(page, 3);

    let match =
      status == 3
        ? //when order status=completed
          { status: { $eq: 3 }, user_id: helper.ObjectId(user_id) }
        : //when order status!=completed
          { status: { $ne: 3 }, user_id: helper.ObjectId(user_id) };

    const rows = await Order.aggregate([
      {
        $match: match,
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: "transactions",
          localField: "transaction_id",
          foreignField: "_id",
          as: "transaction",
        },
      },
      { $unwind: { path: "$transaction", preserveNullAndEmptyArrays: true } },

      { $addFields: { total: "$transaction.total_amount" } },

      {
        $project: {
          id: "$_id",
          _id: 0,
          order_id: 1,
          rated: 1,
          notes: 1,
          status: 1,
          total: 1,
        },
      },

      {
        $facet: {
          data: [{ $count: "total" }],
          metaData: [
            { $skip: offset },
            { $limit: limit },

            {
              $project: {
                id: 1,
                order_id: 1,
                rated: 1,
                notes: 1,
                status: 1,
                total: 1,
              },
            },
          ],
        },
      },
    ]);

    let total;
    let result = [];
    if (rows[0].metaData.length > 0) {
      if (!_.isEmpty(rows[0].data)) total = rows[0].data[0].total;

      // let info   = rows[0].metaData
      // for (var key in info) {
      //   result[key] = info[key]
      //   result[key]['age'] = helper.rand(100, 789)

      // }
    } else {
      total = 0;
    }

    const data = {
      data: rows[0].metaData,
      pagedata: {
        current_page: +page || 1,
        per_page: limit,
        total: total,
        lastPage: Math.ceil(total / limit),
      },
    };

    return helper.sendSuccess(data, res, req.t("data_retrived"), 200);
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

module.exports = {
  getDeliveryCharge,
  getCheckoutInfo,
  checkOrder,
  applyCoupon,
  placeOrder,
  orders,
  stripeSuccess,
  stripeCancel,
};
