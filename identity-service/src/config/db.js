const mongoose = require("mongoose");
const logger = require("../utils/logger.js");

async function connectDB() {
    try {
        const dbURI = process.env.MONGODB_URI;
        await mongoose.connect(dbURI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        logger.info("Database connected successfully");
    } catch (error) {
        logger.error("Database connection failed:", error.message);
        process.exit(1); // Exit the process with failure
    }
}

module.exports = connectDB;