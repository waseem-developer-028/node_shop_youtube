const express = require('express');

const app = express();
const blueBirdPromise = require('bluebird');
const jwt = blueBirdPromise.promisifyAll(require('jsonwebtoken'));
const { settings } = require('../constant/common');
const User = require('../models/user');

const authenticate = (req, res, next) => {
  const token = req.headers['Authorization'] || req.headers['authorization']; // eslint-disable-line
  if (!token) {
    return helper.sendError('', res, 'No token provided.', 200);
  }
  jwt.verify(token, process.env.TOKEN_SECRET, async (error, decoded) => {
    if (error) {
      helper.sendError(error, res,req.t('invalid_token'), 401);
    } else if (decoded.userId == 0 || undefined || '') {
      helper.sendError(error, res, req.t('user_not_found'), 401);
    } else {
      const result = await User.findOne({ api_token: token });
      if (result) {
        if (result.status == false || result.status == 0) {
          helper.sendError(error, res, req.t('account_deactived'), 200);
        } else {
          return next();
        }
      } else {
        helper.sendError(error, res,req.t('session_expired'),403);
      }
    }
  });
};

const auth_without_login = (req, res, next) => {
  const deviceType = req.headers['devicetype'] ? req.headers['devicetype'] : 'web';
  const deviceToken = req.headers['devicetoken'] ? req.headers['devicetoken'] : '';
  req.data = {
    deviceType,
    deviceToken,
  };
  return next();
};

const genrateUserToken = (data) => {
  const options = { expiresIn: settings.expiresIn };
  return jwt
    .signAsync(data, process.env.TOKEN_SECRET, options)
    .then((jwtToken) => {
      return jwtToken;
    })
    .catch((error) => {
      // eslint-disable-next-line no-undef
      return helper.sendException(res, error.message, error.errorCode)
    });
};

module.exports = {
  genrateUserToken,
  auth_without_login,
  authenticate,
};
