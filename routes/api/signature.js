const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const auth = require("../../middleware/auth")
const Signature = require("../../models/Signature");
const User = require("../../models/User");
const multer = require('multer')
const path = require('path')
const fs = require('fs')

var storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        const {userName} = req.body
        const DIR = `./uploads/${userName}`
        fs.exists(DIR, exist =>{
            if (!exist) {
                return fs.mkdir(DIR, error => cb(error, DIR))
            }
            return cb(null, DIR)
        })
    },
    filename: (req, file, cb)=>{
        const {userName} = req.body
        cb(null, file.fieldname + '-' + Date.now());
    }
})

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb)=>{
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

// @route POST api/sign
// @desc  create or update a user signature 
// @acess Private
router.post('/add', [auth], upload.any(), async(req, res, next)=>{
        try {
            if (!req.body && !req.files) {
                res.json({success: false})
            }else{
                var c;
                Signature.findOne({}, (err, data)=>{
                    if (data) {
                        c = data.unique_id + 1
                    }else{
                        c = 1
                    }
                    var user_sign = new Signature({
                        user: req.user.id,
                        unique_id:c,
                        sign1: req.files[0] && req.files[0].filename ? req.files[0].filename: '',
                        sign2: req.files[1] && req.files[1].filename ? req.files[1].filename: '',
                        sign3: req.files[2] && req.files[2].filename ? req.files[2].filename: '',
                        sign4: req.files[3] && req.files[3].filename ? req.files[3].filename: '',
                        sign5: req.files[4] && req.files[4].filename ? req.files[4].filename: '',
                        sign6: req.files[5] && req.files[5].filename ? req.files[5].filename: '',
                        sign7: req.files[6] && req.files[6].filename ? req.files[6].filename: '',
                        sogn8: req.files[7] && req.files[7].filename ? req.files[7].filename: ''
                    })
                    user_sign.save((err, person)=>{
                        if(err)
                            console.log(err);
                        else{
                            return res.json(user_sign);
                        }
                    })
                }).sort({_id: -1}).limit(1);
            }
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error')
        }
    
})



module.exports = router;
