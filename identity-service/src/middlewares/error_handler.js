const logger = require("../utils/logger.js");

const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);
    res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
    next();
}

module.exports = errorHandler;