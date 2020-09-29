const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
    check,
    validationResult
} = require("express-validator");
const Beneficiary = require("../models/Beneficiary");
const Charity = require("../models/Charity");

router.get("/", auth, async (req, res) => {
    try {
        const beneficiaries = await Beneficiary.find();
        res.json(beneficiaries);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

router.post(
    "/",
    auth,
    [
        check("name", "Name is required").not().isEmpty(),
        check("job_title", "Job title is required").not().isEmpty(),
        check("address", "Address is required").not().isEmpty(),
        check("province", "Province is required").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("phone_number", "Phone Number is required").not().isEmpty(),
        check("ktp", "KTP is required").not().isEmpty(),
        check("kartu_keluarga", "Kartu Kelauaga is required").not().isEmpty(),
        check("thumbnail", "Photo is required").not().isEmpty(),
        check("is_verified", "Verify is required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
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
            thumbnail,
            is_verified,
            charity_id,
        } = req.body;
        try {
            // check if beneficiary exist
            const charity = await Charity.findOne({
                _id: charity_id,
            });
            const existingBeneficiary = await Beneficiary.find({
                'email': email,
                'charity': charity_id
            });
            if (existingBeneficiary != "") {
                return res.status(400).send({
                    errors: [{
                        msg: "Email already exists."
                    }]
                });
            } else {
                const beneficiary = new Beneficiary({
                    charity: charity.id,
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
                    thumbnail,
                    is_verified
                });
                await beneficiary.save();
                res.json({
                    msg: "Data submitted"
                });
            }
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }
    }
);

router.get(
    "/:beneficiary_id",
    auth,
    async ({
        params: {
            beneficiary_id
        }
    }, res) => {
        try {
            const beneficiary = await Beneficiary.findOne({
                _id: beneficiary_id,
            });
            res.json(beneficiary);
        } catch (errors) {
            console.error(errors.message);
            res.status(500).send("Internal server error");
        }
    }
);

router.delete('/:beneficiary_id', auth, async ({
    params: {
        beneficiary_id
    }
}, res) => {
    try {
        await Beneficiary.findOneAndDelete({
            _id: beneficiary_id
        });
        res.json('Data deleted');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;