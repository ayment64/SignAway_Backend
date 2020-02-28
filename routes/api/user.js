const express = require('express');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User')


const router = express.Router();

// @route GET api/users
// @desc  Test route 
// @acess Public 
router.get('/', (req, res) => {
    res.send('User route')
});

// @route POST api/users
// @desc  Register user 
// @acess Public 
router.post('/', [
            check('name', 'Name is required')
            .not()
            .isEmpty(),
            check('email', 'Please enter a valid email')
            .isEmail(),
            check('password', 'Please enter a password with 6 or more characters')
            .isLength({
                min: 6
            })
        ], async(req, res) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }

                const { name, email, password, role } = req.body;
                try {
                    // See if user exists
                    let user = await User.findOne({ email })
                    if (user) {
                        return res.status(400).json({ errors: [ { msg: 'User Already exists' } ] })
                    }
                    // Get users gravatar
                    const avatar = gravatar.url(email, {
                        s: '200',
                        r: 'pg',
                        d: 'mm'
                    })

                    user = new User({
                        name,
                        email,
                        avatar,
                        role,
                        password
                    })
                    // Encrypt password
                    const salt = await bcrypt.genSalt(10);

                    user.password = await bcrypt.hash(password, salt);

                    await user.save()
                    // return JWT
                    const payload = {
                        user: {
                            id: user.id
                        }
                    }

                    jwt.sign(
                        payload, 
                        config.get('jwtToken'),
                        { expiresIn: 360000 },
                        (err, token) => {
                            if (err) {
                                throw err
                            } else {
                                res.json({ token })
                            }
                        })
                    // res.send('User registered')
                } catch (err) {
                    console.error(err.message);
                    res.status(500).send('Server error')
                    
                }
                
});

module.exports = router;
