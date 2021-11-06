// require multer
const multer = require('multer')

// require path
const path = require('path')

// init storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../uploads/');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


// init upload
const upload = multer({ storage: storage })

// export 
module.exports = upload