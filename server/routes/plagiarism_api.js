// init Api base
const API_BASE = '/v1/api'

// require verify
const verify = require('../helpers/verify')

// require axios
const axios = require('axios')

// require uploads
const upload = require('../helpers/uploads')

// express file upload
const fileUpload = require('express-fileupload');

// require any text
const reader = require('any-text');
const { compare } = require('bcryptjs');

// plagiarism flask API BASE
const plagiarism_API = 'https://plagiarism-detector-flask.herokuapp.com/api/v1/plagiarism/checker'

// export plagiarism api route
module.exports = (app) => {

    // middleware for file upload

    // init get api endpoint
    app.post(`${API_BASE}/check`, verify, async(req, res) => {

        try {

            // get query data
            const getQueryData = {
                query: req.body.queryDoc,
                compareData: req.body.compareDoc
            }

            console.log(req.body)

            // validate
            if (!getQueryData.query) {
                return res.json({
                    success: false,
                    message: "Query field must not be empty"
                })
            }

            // get text from query document
            const queryData = await reader.getText(getQueryData.query);

            // get text from compare document
            const compareData = await reader.getText(getQueryData.compareData)


            // init plagiarismData object
            const plagiarismData = {
                query: queryData,
                compareData: [compareData]
            }

            // // send queryData to plagiarism checker flask api
            const response = await axios.post(`${plagiarism_API}`, plagiarismData)

            // return plagiarism result response
            return res.json(JSON.parse(JSON.stringify(response.data)));

        } catch (error) {
            console.log(error)
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }



    })


    // get request
    app.get(`${API_BASE}/verify`, verify, async(req, res) => {
        try {

            return res.json({
                success: true,
                message: "Authorization successful",
                user: req.user
            })

        } catch (error) {
            console.log(error)
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    })


    // Upload document Api endpoint
    app.post(`${API_BASE}/upload`, verify, (req, res, next) => {

        // check if files
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                success: false,
                message: "File not found"
            })
        }

        // get documentFile
        const docFile = req.files.doc

        // upload path
        const uploadPath = `${process.cwd()}/uploads/${Date.now().toString()}-${docFile.name}`

        // save the file using mv file
        docFile.mv(uploadPath, function(error) {
            console.log(error)
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                })
            }

            // return response
            return res.json({
                success: true,
                message: "Upload Successful",
                data: uploadPath
            })

        })


    })
}