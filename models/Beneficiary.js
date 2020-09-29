const mongoose = require('mongoose');

const BeneficiarySchema = new mongoose.Schema({
    charity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'charity'
    },
    name: {
        type: String,
        required: true,
    },
    job_title: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    province: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    lat: {
        type: Number
    },
    lon: {
        type: Number
    },
    alt: {
        type: Number
    },
    ktp: {
        type: String,
        required: true,
    },
    kartu_keluarga: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    is_verified: {
        type: Boolean,
        required: true,
    },
    donation: [{
        donation_id: {
            type: String
        },
        amount: {
            type: Number
        }
    }]
});

module.exports = Beneficiary = mongoose.model('beneficiary', BeneficiarySchema);