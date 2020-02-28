const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const auth = require("../../middleware/auth")
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route GET api/profile/me
// @desc  Test route 
// @acess Public 
router.get('/me',auth, async (req, res)=>{
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', 
        ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'ther is no profile for this user' })
        }

        res.json(profile)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
        
    }
});

// @route POST api/profile
// @desc  create or update a user profile 
// @acess Private
router.post('/', [auth, [
        check('first_name', 'Fist Name is required')
        .not()
        .isEmpty(),
        check('last_name', 'Last Name is required')
        .not()
        .isEmpty(),
        check('birthday', 'Birthday is required')
        .not()
        .isEmpty(),
        check('location', 'Location is required')
        .not()
        .isEmpty(),
        check('job', 'Job is required')
        .not()
        .isEmpty(),
        check('cin_num', 'Cin number is required')
        .not()
        .isEmpty(),
        check('assurence', 'Assurence is required')
        .not()
        .isEmpty(),
        check('bank', 'Bank is required')
        .not()
        .isEmpty(),
        check('phone_num', 'Phone number is required')
        .not()
        .isEmpty()
    ]], async (req, res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
        }

    const { first_name, last_name, birthday, location, phone_num, cin_num, assurence, bank, job } = req.body;
    //build profile object
    const profileFields = {} ;
    profileFields.user = req.user.id
    if (first_name) profileFields.first_name = first_name;
    if (last_name) profileFields.last_name = last_name;
    if (birthday) profileFields.birthday = birthday;
    if (location) profileFields.location = location;
    if (phone_num) profileFields.phone_num = phone_num;
    if (cin_num) profileFields.cin_num = cin_num;
    if (assurence) profileFields.assurence = assurence;
    if (bank) profileFields.bank = bank;
    if (job) profileFields.job = job;

    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
            profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set:
            profileFields },
            { new: true });
            return res.json(profile);
        }
        // create profile
        profile = new Profile(profileFields);
        await profile.save();
        return res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error')
    }
})


module.exports = router;
