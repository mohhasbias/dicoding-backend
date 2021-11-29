const Joi = require('joi');

const threadSchema = Joi.object({
    owner: Joi.string().required(),
    title: Joi.string().required(),
    body: Joi.string().required(),
}).required();

const newThread = (thread) => Joi.attempt(thread, threadSchema);

module.exports = newThread;
