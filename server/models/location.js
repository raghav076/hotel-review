const mongoose = require('mongoose')
const { Schema } = mongoose;

const location = new Schema({
    location: {
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true });

const locationModel = mongoose.model('Location', location);

module.exports = { locationModel };
