const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const RefreshToken = require("../models/refreshtoken.js");

async function generateTokens(user) {
    const accessToken = jwt.sign({
        userId: user._id,
        username: user.username,
    }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });
    const refreshToken = crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
        token: refreshToken,
        user: user._id,
        expiresAt: expiresAt,
    });
    return {
        accessToken,
        refreshToken
    };
}

module.exports = generateTokens;