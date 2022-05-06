import joi from "joi";

const operationSchema = joi.object({
    amount : joi.number().positive().required(),
    description: joi.string().max(100).min(4).required(),
    type: joi.string().valid("entry", "exit").required()
})

export default operationSchema;