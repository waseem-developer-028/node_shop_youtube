/* global LOCALE */
const Cart = require("../../models/cart");
const Product = require("../../models/product");
const User = require("../../models/user");

const getCart = async (req, res) => {
  try {
    let { user_id } = req.query;
    const user = await User.findById(user_id).select("email");

    if (!user) return helper.sendError({}, res, req.t("user_not_found"), 200);

    const data = await Cart.find(
      { user_id: helper.ObjectId(user_id) },
      { id: 1, user_id: 1, quantity: 1, size: 1, color: 1 }
    )
      .populate({ path: "product_id", select: "_id image name price" })
      .sort({ createdAt: -1 });

    return helper.sendSuccess(data, res, req.t("cart_get"), 200);
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

const addCart = async (req, res) => {
  try {
    let { user_id, quantity, product_id, size, color } = req.body;

    const product = await Product.findById(product_id).select("_id qty");

    const user = await User.findById(user_id).select("email");

    if (!user) return helper.sendError({}, res, req.t("user_not_found"), 200);
    else if (!product)
      return helper.sendError({}, res, req.t("product_not_found"), 200);
    else if (product.qty < 1)
      return helper.sendError({}, res, req.t("product_out_of_stock"), 200);

    const save = await Cart.create({
      user_id: user_id,
      quantity: quantity,
      product_id: product_id,
      size: size ? size : "M",
      color: color ? color : "#B11D1D",
    });

    if (!save)
      return helper.sendException(res, req.t("something_is_wrong"), 200);

    return helper.sendSuccess({}, res, req.t("cart_add"), 200);
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

const updateCart = async (req, res) => {
  try {
    let { quantity } = req.body;
    let { id } = req.params;

    const save = await Cart.findByIdAndUpdate(id, { quantity: quantity });

    if (!save)
      return helper.sendException(res, req.t("something_is_wrong"), 200);

    return helper.sendSuccess({}, res, req.t("cart_update"), 200);
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

const deleteCart = async (req, res) => {
  try {
    let { id } = req.params;

    const save = await Cart.findByIdAndDelete(id);

    if (!save)
      return helper.sendException(res, req.t("something_is_wrong"), 200);

    return helper.sendSuccess({}, res, req.t("cart_delete"), 200);
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

module.exports = {
  getCart,
  addCart,
  updateCart,
  deleteCart,
};
