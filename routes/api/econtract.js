const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require("../../middleware/auth")
const Econtract = require("../../models/E-contract");
const User = require("../../models/User");
const multer = require('multer')
const path = require('path')
const fs = require('fs');

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
        if (Object.keys(req.route.methods)[0] == 'post') {
            cb(null, req.user.id);

        } else {
            cb(null, req.params.targetID);

        }
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

router.post('/add', [auth], upload.single('file'), async (req, res, next) => {
    try {
        if (!req.body && !req.file) {
            res.json({ success: false })
        }
        var econtract = new Econtract({
            user: req.user.id,
            title: req.body.title,
            user_target: req.body.user_target,
            description: req.body.description,
            signature: req.file.filename
        })
        econtract.save((err, contract) => {
            if (err)
                console.log(err);
            else {
                return res.json(econtract);
            }
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error')
    }
})

router.put('/updatetarget/:targetID', upload.single('file'), async (req, res, next) => {
    Econtract.findOneAndUpdate(
        { user_target: req.params.targetID },
        { signature_target: req.file.filename }, (err, econtract) => {
            if (err) {
                res.send(err)
            } else {
                res.send(econtract)
            }
        })
})



module.exports = router;
