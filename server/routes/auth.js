// require userModel
const User = require('../models/User')

// require Validator
const { registerValidation, loginValidation } = require('../helpers/validator')

// require bcrypt
const bcrypt = require('bcryptjs')

// require jsonwebtoken
const jwt = require('jsonwebtoken')

// init Api base
const API_BASE = '/v1/api'

// export auth route
module.exports = (app) => {

    // init Register API handler
    app.post(`${API_BASE}/user/register`, async(req, res) => {

        try {
            // get req data
            const registerData = {
                fullName: req.body.fullName,
                email: req.body.email,
                password: req.body.password
            }

            // validate register Data
            const { error } = await registerValidation(registerData)

            // check if error
            if (error) {

                return res.status(400).json({
                    success: false,
                    message: error.details[0].message,
                })
            }


            // find email in DB
            const emailExist = await User.findOne({ email: registerData.email })

            // check if email exist
            if (emailExist) {
                return res.json({
                    success: false,
                    message: "User with email and password already exist"
                })
            }

            // generate salt
            const genSalt = await bcrypt.genSalt(10)

            // hash password
            const hashPassword = await bcrypt.hash(registerData.password, genSalt)

            // create new User
            const newUser = new User({
                fullName: registerData.fullName,
                email: registerData.email,
                password: hashPassword
            })

            // save user
            await newUser.save()

            // return success
            return res.json({
                success: true,
                message: "Registration Successfull"
            })


        } catch (error) {
            console.log(error)
                // return response
            return res.status(400).json({
                success: false,
                message: "Oops! An error has occured, please try again"
            })
        }

    })


    // init Login API endpoint
    app.post(`${API_BASE}/user/login`, async(req, res) => {
        try {
            // get login data 
            const loginData = {
                email: req.body.email,
                password: req.body.password
            }

            // validate login Data
            const { error } = loginValidation(loginData)

            // check if error
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message,
                })
            }

            // find User 
            const user = await User.findOne({ email: loginData.email })

            // check if not user
            if (!user) {
                return res.json({
                    success: false,
                    message: "Email or Password is incorrect"
                })
            }

            // compare password
            const comparePass = await bcrypt.compare(loginData.password, user.password)

            // check if password is not correct
            if (!comparePass) {
                return res.json({
                    success: false,
                    message: "Email or Password is incorrect"
                })
            }

            // sign token
            const genToken = await jwt.sign({ _id: user._id, fullName: user.fullName }, process.env.Login_Secret)


            // assign token to response header
            await res.header("auth_token", genToken).json({
                success: true,
                message: "Login Successful",
                token: genToken
            })


        } catch (error) {
            console.log(error)
            return res.status(400).json({
                success: false,
                message: "Oops! An error occured, please try again"
            })
        }
    })

}