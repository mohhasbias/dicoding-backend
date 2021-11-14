const Joi = require('joi');

const userSchema = Joi.object({
    username: Joi.string().required().ruleset.token().rule({ message: 'username mengandung karakter terlarang' }),
    password: Joi.string().required(),
    fullname: Joi.string().required(),
}).required();

const newUser = (user) => {
    const validatedUser = Joi.attempt(user, userSchema);
    return validatedUser;
};

module.exports = newUser;
