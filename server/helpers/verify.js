// require jwt
const jwt = require('jsonwebtoken')



// verify
module.exports = async(req, res, next) => {
    try {

        // get token from request header
        const getToken = req.headers.authorization

        console.log(getToken)

        // if no token
        if (!getToken) {
            return res.json({
                success: false,
                message: "Access Denied"
            })
        }

        // verify token
        const verifyToken = await jwt.verify(getToken, process.env.Login_Secret)

        // assign verifyToken to req.user
        req.user = verifyToken

        // call next
        next()

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Oops! An Error occured"
        })

    }



}