const express = require('express');

const app = express();



const localization = (req, res, next) => {
    let locale  = req.headers['accept-language'] ? req.headers['accept-language'] : 'en';
    app.set('locale', locale);
    global.LOCALE = locale
    next();
};



module.exports = localization

 