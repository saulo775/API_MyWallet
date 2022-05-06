import joi from "joi";

const updateOperationSchema = joi.object({
    amount : joi.number().positive().required(),
    description: joi.string().max(100).min(4).required(),
});

export default updateOperationSchema;