const Joi = require('joi');

exports.validateAdmin = (admin) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(200).required(),
        first_name: Joi.string().min(3).max(200).required(),
        last_name: Joi.string().min(3).max(200).required(),
        email: Joi.string().email().min(5).max(255).required(),
    });
    return schema.validate(admin);
};

exports.validateUpdateAdmin = (admin) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(200).optional(),
        first_name: Joi.string().min(3).max(200).optional(),
        last_name: Joi.string().min(3).max(200).optional(),
        email: Joi.string().email().min(5).max(255).optional(),
    });
    return schema.validate(admin);
};
