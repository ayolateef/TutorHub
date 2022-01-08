const Joi = require('joi');

exports.validateUpdateTutor = (tutor) => {
    const schema = Joi.object({
        first_name: Joi.string().min(3).max(255).optional(),
        last_name: Joi.string().min(3).max(255).optional(),
        phone: Joi.string().min(11).optional(),
        rate: Joi.number().optional(),
    });

    return schema.validate(tutor);
};
