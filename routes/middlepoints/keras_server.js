const request = require('request')
const express = require('express')
const fs = require('fs');
const { body } = require('express-validator');
const multer = require('multer')


const router = express.Router();

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const DIR = `./uploads/`
        fs.exists(DIR, exist => {
            if (!exist) {
                return fs.mkdir(DIR, error => cb(error, DIR))
            }
            return cb(null, DIR)
        })
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
})

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ) {
            cb(null, true)
        } else {
            console.log('only jpg & png file supported!')
            cb(null, false)
        }
    }

})


router.get('/test', async (req, res, next) => {
    try {
        request('http://127.0.0.1:2700/', await ((error, response, body) => {
            console.error('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
            res.send(body)
        }))
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})

// router.post('/registersign', async(req, res, next)=>{
//     let userId = req.query.userId
//     request.post('http://127.0.0.1:2700/registersign?userId='+userId, (error, response, body)=>{

//     })
// })

// const formData = {
//     field: 'my value',
//     buffer: Buffer.from([1, 2, 3, 4, 5, 6, 7, 8])
// }

router.post('/predict', upload.single('file'), async (req, res, next) => {
    const predictOptions = {
        method: 'POST',
        url: 'http://127.0.0.1/predict',
        port: 2700,
        headers: { "Content-Type": "multipart/form-data" },
        formData: {
            "file": fs.createReadStream(req.file.originalname)
        }

    }
    request.post(predictOptions, (error, response, body) => {
        console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        res.send(body)
    })
})


module.exports = router;
