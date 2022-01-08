const Joi = require('joi');

exports.validateCreateSubject = (subject) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(3).max(200).optional(),
        duration: Joi.number().required(),
    });
    return schema.validate(subject);
};

exports.validateUpdateSubject = (subject) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).optional(),
        description: Joi.string().min(3).max(200).optional(),
        duration: Joi.number().optional(),
    });
    return schema.validate(subject);
};
