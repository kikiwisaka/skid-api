const {
    mongo
} = require('mongoose');
const mongoose = require('mongoose');

const DonaationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    payment_channel: {
        type: String,
        required: true
    },
    created_date: {
        type: Number,
        required: true
    },
    completed_date: {
        type: Number,
        required: false
    },
    transaction_id: {
        type: String,
        required: false
    },
    charity_id: {
        type: String,
        required: false
    },
    beneficiary_id: {
        type: String,
        required: false
    }
});

module.exports = Donation = mongoose.model("donation", DonaationSchema);