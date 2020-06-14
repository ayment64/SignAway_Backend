const request = require('request')
const express = require('express')

const router = express.Router();


router.get('/test', async(req, res, next)=>{
    try {
        request('http://127.0.0.1:2700/', await((error, response, body)=>{
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

module.exports = router;
