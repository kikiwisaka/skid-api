const mongoose = require("mongoose");

const CharitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = Charity = mongoose.model("charity", CharitySchema);
