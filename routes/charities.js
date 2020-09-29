const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const {
    check,
    validationResult
} = require("express-validator");
const Charity = require("../models/Charity");


router.post('/', auth,
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
            res.json('Create new charity successful');
        } catch (err) {
            console.error(err.message);
            res.sendStatus(500).json("Internal server error");
        }
    });

router.get('/', auth, async (req, res) => {
    try {
        const charities = await Charity.find();
        res.json(charities);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
    res.send('charities router');
});

router.get('/:charity_id', auth, async ({
    params: {
        charity_id
    }
}, res) => {
    try {
        const charity = await Charity.findOne({
            _id: charity_id
        });
        res.json(charity);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.put('/:charity_id',
    [
        check("name", "Name is required").not().isEmpty(),
        check("description", "Description is required").not().isEmpty()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        const {
            id,
            name,
            description
        } = req.body;
        console.log(req.body);
        try {
            let isCharityExist = await Charity.findOne({
                name
            });
            console.log(isCharityExist);
            if (isCharityExist) {
                if (isCharityExist.id != id) {
                    return res.status(400).json({
                        errors: [{
                            msg: "Charity already exists."
                        }]
                    });
                }
            }
            await Charity.findOneAndUpdate({
                _id: id
            }, {
                $set: {
                    'name': name,
                    'description': description
                }
            });
            let charity = await Charity.findOne({
                _id: id
            });
            res.json(charity);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Internal server error');
        }
    });

router.delete('/:charity_id', auth, async ({
    params: {
        charity_id
    }
}, res) => {
    try {
        await Charity.findOneAndDelete({
            _id: charity_id
        });
        res.json('Delete successful');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;