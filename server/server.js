// require modules
const express = require('express')

// require mongoose
const mongoose = require('mongoose')

// dotenv
const dotenv = require('dotenv')

// morgan
const morgan = require('morgan')

// cors
var cors = require('cors')

// express file upload
const fileUpload = require('express-fileupload');




// init express app
const app = express()


// init dotenv
dotenv.config()

// use morgan
app.use(morgan('dev'))


// mongoose connect
mongoose.connect(process.env.MongoURI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
    .then((success) => {
        console.log("Database Connection is Successful")
    })
    .catch((error) => {
        console.log(error)
    })

// ========================MIDDLEWARES =====================================
app.use(cors({
    origin: "http://localhost:3000"
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// default options
app.use(fileUpload());




// =========================ROUTES==========================================
// require Route modules
require('./routes/auth')(app)
require('./routes/plagiarism_api')(app)



// listen
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})