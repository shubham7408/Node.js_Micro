const Joi = require("joi");

const validateRegistration = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(6).max(128).required(),
        email: Joi.string().email().required()
    });

    return schema.validate(data);
};

module.exports = {
    validateRegistration
};