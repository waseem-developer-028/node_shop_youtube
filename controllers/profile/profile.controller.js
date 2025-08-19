const Cart = require("../../models/cart");
const User = require("../../models/user");
const { fileUploadExpress } = require("../../middlewares/fileupload");
const { PASSWORD } = require("../../constant/common");
const bcrypt = require("bcryptjs");

const saveUserImage = async (req, res) => {
  if (!req.files) {
    return helper.sendError({}, res, "Please Select File.", 200);
  }
  try {
    const user = await User.findOne({
      api_token: req.headers["Authorization"] || req.headers["authorization"],
    });

    if (!user) return helper.sendError(res, "Invalid User", 200);

    const file = req.files.photo;
    const directory = "./public/users";

    const isValidFile = await fileUploadExpress({
      filename: file.name,
      data: file.data,
      directory: directory,
      size: file.size,
      dbFileName: user.image,
    });
    if (isValidFile.status !== "success") {
      return helper.sendError({}, res, isValidFile.message, 200);
    }

    const imageName = isValidFile.imageName;

    const updateImage = await User.findByIdAndUpdate(user._id, {
      image: imageName,
    });

    if (!updateImage) {
      return helper.sendError({}, res, "Please try again after sometime!", 200);
    }

    file.mv(`${directory}/` + imageName);

    const cartCount = await Cart.countDocuments({
      user_id: helper.ObjectId(user._id),
    });

    const data = {
      id: user._id,
      name: user.name,
      email: user.email,
      social_id: user.social_id,
      login_type: user.login_type,
      api_token: user.api_token,
      role: user.role,
      image: imageName,
      cartCount: cartCount,
    };
    return helper.sendSuccess(data, res, "File uploaded successfully!", 200);
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

const changePassword = async (req, res) => {
  const { current_password, confirm_password } = req.body;
  try {
    const user = await User.findOne({
      api_token: req.headers["Authorization"] || req.headers["authorization"],
    });

    if (!user) return helper.sendError(res, "Invalid User", 200);

    if (!bcrypt.compareSync(current_password, user.password)) {
      return helper.sendError({}, res, req.t("invalid_password"), 200);
    }

    if (current_password === confirm_password) {
      return helper.sendError(
        {},
        res,
        "New password cannot be same as old paasword",
        200
      );
    }

    const salt = bcrypt.genSaltSync(PASSWORD.SALT_LENGTH);
    const password = bcrypt.hashSync(confirm_password.trim(), salt);

    const updatePassword = await User.findByIdAndUpdate(user._id, {
      password: password,
    });

    if (!updatePassword) {
      return helper.sendError({}, res, "Please try again after sometime!", 200);
    }

    return helper.sendSuccess({}, res, "Password changed successfully!", 200);
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

module.exports = {
  saveUserImage,
  changePassword,
};
