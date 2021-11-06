// require joi
const Joi = require('joi')


// init registerValidation function
module.exports.registerValidation = (data) => {
    const registerSchema = Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })

    // return validate
    return registerSchema.validate(data)

}

// init loginValidation function
module.exports.loginValidation = (data) => {
    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })

    // return validate
    return loginSchema.validate(data)
}