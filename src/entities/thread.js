const Joi = require('joi');

const threadSchema = Joi.object({
    owner: Joi.string().required(),
    title: Joi.string().required(),
    body: Joi.string().required(),
}).required();

const newThread = (thread) => {
    const validatedThread = Joi.attempt(thread, threadSchema);
    return validatedThread;
};

module.exports = newThread;
