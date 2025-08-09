const rateLimit = require('express-rate-limit');

const createBasicRateLimiter = (maxRequests, time) => {
    return rateLimit({
        max: maxRequests,
        windowMs: time,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res, next, options) => {
            // Custom JSON error response
            res.status(options.statusCode).json({
                status: 'error',
                message: options.message || 'Too many requests, please try again later',
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            });
        },
        message: 'Too many requests, please try again later'
    });
};

module.exports = { createBasicRateLimiter };
