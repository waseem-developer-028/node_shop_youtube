const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validate = require("mongoose-validator");
const _ = require("lodash");

const nameValidator = [
  validate({
    validator: "isLength",
    arguments: [0, 40],
    message: "First must not exceed {ARGS[1]} characters.",
  }),
  validate({
    validator: "isAlphanumeric",
    message: "Name should contain alpha-numeric characters only",
  }),
];

const emailValidator = [
  validate({
    validator: "isLength",
    arguments: [0, 60],
    message: "Email must not exceed {ARGS[1]} characters.",
  }),
  validate({
    validator: "isEmail",
    message: "Email must be valid.",
  }),
];

const userSchema = Schema(
  {
    name: {
      type: String,
      default: null,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    email_verified_at: {
      type: Date,
      default: null,
    },
    email_verified_status: {
      type: Boolean,
      default: false,
    },
    api_token: {
      type: String,
      trim: true,
      default: null,
    },
    otp: {
      type: Number,
      integer: true,
      trim: true,
      index: true,
      get: (v) => Math.round(v),
      set: (v) => Math.round(v),
      default: null,
    },
    role: {
      type: Number,
      integer: true,
      default: 0, // 0=user, 1=admin
    },
    device_token: {
      type: String,
      default: null,
    },
    status: {
      type: Number,
      integer: true,
      get: (v) => Math.round(v),
      set: (v) => Math.round(v),
      default: 1,
    },
  },
  { timestamps: true, strict: true }
);

userSchema.pre("save", function (next) {
  this.name = _.upperFirst(_.toLower(this.name));
  next();
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // delete ret._id;
    delete ret.password;
  },
});

module.exports = mongoose.model("User", userSchema);
