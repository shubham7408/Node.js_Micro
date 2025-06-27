const mongoose = require("mongoose");

async function connectDB() {
    try {
        const dbURI = process.env.MONGODB_URI;
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1); // Exit the process with failure
    }
}

module.exports = connectDB;