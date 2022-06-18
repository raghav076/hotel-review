const mongoose = require('mongoose')
const { Schema } = mongoose;

const reviewSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true,
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        required: true,
        min: 10,
    }
}, { timestamps: true });

const reviewModel = mongoose.model('Review', reviewSchema);

module.exports = { reviewModel };
