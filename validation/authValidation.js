const Joi = require('joi');

exports.validateLogin = (req) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(req);
};

exports.validateSuperAdminLogin = (req) => {
    const schema = Joi.object({
        username: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(req);
};

exports.validateTutorRegister = (req) => {
    const schema = Joi.object({
        first_name: Joi.string().min(3).max(255).required(),
        last_name: Joi.string().min(3).max(255).required(),
        email: Joi.string().min(3).max(255).required(),
        password: Joi.string().min(6).max(255).required(),
        phone: Joi.string().min(11).optional(),
        rate: Joi.number().required(),
    });
    return schema.validate(req);
};
