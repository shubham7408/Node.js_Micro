const User = require("../models/user.js");
const logger = require("../utils/logger.js");
const { validateRegistration } = require("../utils/Validation.js");
const generateTokens = require("../utils/GenerateTokens.js");

async function registerUser(req, res) {
    try {
        const { error } = validateRegistration(req.body);
        if (error) {
            logger.warn("Validation error in registerUser:", error.details[0].message);
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({
                success: false,
                message: "Username, password, and email are required."
            });
        }
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username or email already exists."
            });
        }
        const newUser = await User.create({
            username,
            password, // Note: Password should be hashed before saving in production
            email
        });
        logger.info("User registered successfully:", newUser.username);
        const { accessToken, refreshToken } = await generateTokens(newUser);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        logger.error("Error in registerUser:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}


module.exports = {
    registerUser
};