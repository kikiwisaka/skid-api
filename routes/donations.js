const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const {
    check,
    validationResult
} = require("express-validator");
const Donation = require("../models/Donation");
const Beneficiary = require('../models/Beneficiary');


router.get('/', auth, async (req, res) => {
    try {
        const donations = await Donation.find();
        res.json(donations);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
});

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

            //insert donation to beneficiary
            await Beneficiary.findOneAndUpdate({
                _id: beneficiary_id
            }, {
                $addToSet: {
                    'donation': {
                        'donation_id': donation.id,
                        'amount': donation.amount
                    }
                }
            });

            res.json('Thank you for donation');
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Internal server error');
        }
    });

module.exports = router;