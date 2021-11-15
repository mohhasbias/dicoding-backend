const Joi = require('joi');

const commentSchema = Joi.object({
    owner: Joi.string().required(),
    content: Joi.string().required(),
    thread: Joi.string().required(),
}).required();

const newComment = (comment) => {
    const validatedComment = Joi.attempt(comment, commentSchema);
    return validatedComment;
};

module.exports = newComment;
