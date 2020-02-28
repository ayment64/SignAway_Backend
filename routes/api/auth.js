const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {
    check,
    validationResult
} = require('express-validator');
const User = require('../../models/User')


// @route GET api/auth
// @desc  Test route 
// @acess Public 
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        
    }
});

// @route POST api/auth
// @desc  Authentificate user client & get token 
// @acess Public 
router.post('/client', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {email,password} = req.body;
    try {
        let user = await User.findOne({
            email
        })
        if (!user) {
            return res.status(400).json({
                errors: [{
                    msg: 'Invalid credentials'
                }]
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        let role = "client"

        const client = role.localeCompare(user.role);

        if (client) {
            console.log('not a client')
            return res.status(400).json({
                errors: [{
                    msg: 'unidentified role'
                }]
            })
        }

        if (!isMatch) {
            return res.status(400).json({
                errors: [{
                    msg: 'Invalid credentials'
                }]
            }) 
        }
        

        // return JWT
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtToken'), {
                expiresIn: 360000
            },
            (err, token) => {
                if (err) {
                    throw err
                } else {
                    res.json({
                        token
                    })
                }
            })
        // res.send('User registered')
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')

    }

});

// @route POST api/auth
// @desc  Authentificate admin & get token 
// @acess Public 
router.post('/admin', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        email,
        password
    } = req.body;
    try {
        let user = await User.findOne({
            email
        })
        if (!user) {
            return res.status(400).json({
                errors: [{
                    msg: 'Invalid credentials'
                }]
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        let role = "admin"

        const client = role.localeCompare(user.role);

        if (client) {
            console.log('not a admin')
            return res.status(400).json({
                errors: [{
                    msg: 'unidentified role'
                }]
            })
        }

        if (!isMatch) {
            return res.status(400).json({
                errors: [{
                    msg: 'Invalid credentials'
                }]
            })
        }


        // return JWT
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtToken'), {
                expiresIn: 360000
            },
            (err, token) => {
                if (err) {
                    throw err
                } else {
                    res.json({
                        token
                    })
                }
            })
        // res.send('User registered')
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')

    }

});

module.exports = router;
