const mongoose = require('mongoose')
const { Schema } = mongoose;

const hotel = new Schema({
    hotel: {
        type: String,
        required: true,
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
    },
    hotel_id: {
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true });

const hotelModel = mongoose.model('Hotel', hotel);

module.exports = { hotelModel };
