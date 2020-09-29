const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const {
    check,
    validationResult
} = require("express-validator");
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -email');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post(
    "/",
    [
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Password is required").exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }
        const {
            email,
            password
        } = req.body;
        try {
            let user = await User.findOne({
                email,
            });
            if (!user) {
                return res.status(400).json({
                    errors: [{
                        msg: "Invalid credentials",
                    }, ],
                });
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({
                    errors: [{
                        msg: "Invalid credentials",
                    }, ],
                });
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };
            jwt.sign(
                payload,
                config.get("jwtSecret"), {
                    expiresIn: 5000,
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token,
                    });
                }
            );
        } catch (error) {
            console.log("catdh");
            console.error(error.message);
            res.sendStatus(500).json("Internal server error");
        }
    }
);

module.exports = router;