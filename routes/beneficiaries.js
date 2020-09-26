const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const {
    check,
    validationResult
} = require("express-validator");
const Beneficiary = require("../models/Beneficiary");
const Donation = require("../models/Donation");

router.post('/',
    [
        check("name", "Name is required").not().isEmpty(),
        check("job_title", "Job title is required").not().isEmpty(),
        check("address", "Address is required").not().isEmpty(),
        check("province", "Province is required").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("phone_number", "Phone Number is required").not().isEmpty(),
        check("ktp", "KTP is required").not().isEmpty(),
        check("kartu_keluarga", "Kartu Kelauaga is required").not().isEmpty(),
        check("is_verified", "Verify is required").not().isEmpty()
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
            job_title,
            address,
            province,
            email,
            phone_number,
            lat,
            lon,
            alt,
            ktp,
            kartu_keluarga,
            is_verified
        } = req.body;
        try {
            const beneficiary = new Beneficiary({
                name,
                job_title,
                address,
                province,
                email,
                phone_number,
                lat,
                lon,
                alt,
                ktp,
                kartu_keluarga,
                is_verified
            });
            console.log(`beneficiary: ${beneficiary}`);
            await beneficiary.save();
            res.json('success');
        } catch (error) {
            res.status(500).send('Internal server error');
        }
    });

module.exports = router;