const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const {
    check,
    validationResult
} = require("express-validator");
const Donation = require("../models/Donation");

router.post('/',
    [
        check("name", "Name is required").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("amount", "Amount is required").not().isEmpty(),
        check("payment_channel", "Payment Channel is required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        console.log(req.body);
        const {
            name,
            email,
            amount,
            payment_channel,
            created_date,
            completed_date,
            charity_id,
            beneficiary_id
        } = req.body;
        try {
            const donation = new Donation({
                name,
                email,
                amount,
                payment_channel,
                created_date,
                completed_date,
                charity_id,
                beneficiary_id
            });
            console.log(`donation: ${donation}`);
            await donation.save();
            res.json('Thank you for donation');
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Internal server error');
        }
    });

module.exports = router;