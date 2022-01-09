const Joi = require('joi');

const userSchema = Joi.object({
    username: Joi.string()
        .required()
        .ruleset.token()
        .rule({ message: 'username mengandung karakter terlarang' }),
    password: Joi.string().required(),
    fullname: Joi.string().required(),
}).required();

const newUser = (user) => Joi.attempt(user, userSchema);

newUser.schema = userSchema;

module.exports = newUser;
