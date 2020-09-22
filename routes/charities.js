const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const {
    check,
    validationResult
} = require("express-validator");
const Charity = require("../models/Charity");

router.get('/', async (req, res) => {
    res.send('charities router');
});

router.post('/',
    [
        check("name", "Name is required").not().isEmpty(),
        check("description", "Description is required").not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        const {
            name,
            description
        } = req.body;

        try {
            let charity = await Charity.findOne({
                name
            });
            if (charity) {
                return res.status(400).json({
                    errors: [{
                        msg: "Charity already exists."
                    }]
                })
            }
            charity = new Charity({
                name,
                description
            });
            await charity.save();
            console.log('charity saved');
        } catch (err) {
            console.error(err.message);
            res.sendStatus(500).json("Internal server error");
        }
    });

module.exports = router;