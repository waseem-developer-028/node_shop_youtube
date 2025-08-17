const rateLimit = require('express-rate-limit');

// Create a limiter for general API routes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    trustProxy: true, // Trust the X-Forwarded-For header
    message: {
        success: false,
        status: 429,
        data: {},
        message: 'Too many requests from this IP, please try again after 15 minutes',
        responseCode: 429
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Create a stricter limiter for auth routes (login, register, etc.)
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 requests per windowMs
    trustProxy: true, // Trust the X-Forwarded-For header
    message: {
        success: false,
        status: 429,
        data: {},
        message: 'Too many login attempts from this IP, please try again after an hour',
        responseCode: 429
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    apiLimiter,
    authLimiter
};
