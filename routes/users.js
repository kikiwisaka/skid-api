const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {
    check,
    validationResult
} = require('express-validator');
const User = require('../models/User');


router.post('/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({
            min: 6
        })
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.sendStatus(400).json({
                errors: errors.array()
            });
        }
        const {
            name,
            email,
            password
        } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (user) {
                return res.status(400).json({
                    errors: [{
                        msg: 'User already exists'
                    }]
                });
            }
            // if (user) {
            //     console.log(user);
            //     return res.sendStatus(400).json({
            //         errors: [{
            //             msg: 'User already exist'
            //         }]
            //     });
            // }
            user = new User({
                name,
                email,
                password
            });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            res.send('user registered');
        } catch (error) {
            console.log('catdh');
            console.error(error.message);
            res.sendStatus(500).json('Internal server error');
        }
    });

module.exports = router;