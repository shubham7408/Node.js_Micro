const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const argon2 = require("argon2");

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        try {
            this.password = await argon2.hash(this.password);
        } catch (error) {
            return next(error);
        }

    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await argon2.verify(this.password, candidatePassword);
}

userSchema.index({ username: 1, email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
