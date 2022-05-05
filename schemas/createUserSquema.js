import joi from "joi";

const createUserSchema = joi.object({
    username: joi.string().alphanum().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    password_confirmation: joi.ref('password')
});

export default createUserSchema;