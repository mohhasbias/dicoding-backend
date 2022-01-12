const Joi = require('joi');

const replySchema = Joi.object({
    owner: Joi.string().required(),
    content: Joi.string().required(),
    thread: Joi.string().required(),
}).required();

const newReply = (reply) => Joi.attempt(reply, replySchema);

module.exports = newReply;
