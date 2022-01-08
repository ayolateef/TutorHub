const Joi = require('joi');

exports.validateCreateCategory = (category) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(3).max(200).optional(),
        photo: Joi.string().optional(),
    });
    return schema.validate(category);
};

exports.validateUpdateCategory = (category) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(3).max(200).optional(),
        photo: Joi.string().optional(),
        slug: Joi.string().optional(),
    });
    return schema.validate(category);
};