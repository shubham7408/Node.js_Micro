const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const refreshtokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

refreshtokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model("RefreshToken", refreshtokenSchema);
module.exports = RefreshToken;