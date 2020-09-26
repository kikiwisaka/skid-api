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
            console.log(`charity before saving to db: ${charity}`);
            await charity.save();
            console.log('charity saved');
            console.log(charity);
            res.json('Create new charity successful');
        } catch (err) {
            console.error(err.message);
            res.sendStatus(500).json("Internal server error");
        }
    });

router.get('/', async (req, res) => {
    try {
        const charities = await Charity.find();
        res.json(charities);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
    res.send('charities router');
});


module.exports = router;