const { hotelModel } = require("../models/hotel");
const { locationModel } = require("../models/location");
const { reviewModel } = require("../models/review");

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getLocations = async (req, res) => {
    try {
        const locations = await locationModel.find();
        return res.status(200).send(locations.map(l=>capitalizeFirstLetter(l.location)));
    } catch (err) {
        return res.status(500).send(err);
    }
}

const getHotels = async (req, res) => {
    try {
        const hotels = await hotelModel.find({ location: req.query.location });
        return res.status(200).send(hotels.map((h)=>capitalizeFirstLetter(h.hotel)));
    } catch (err) { 
        return res.status(500).send(err);
    }    
}

const arrange = (reviews) => {
    let newReviews = {};
    reviews.forEach((review) => {
        const r = { username: review.username, review: review.review, rating: review.rating, location: review.location.location };
        if (!newReviews[review.hotel.hotel]) {
            newReviews[review.hotel.hotel] = { hotel: review.hotel.hotel, rating: review.rating, count: 1, reviews: [r]};
        }
        else { 
            newReviews[review.hotel.hotel].rating = (review.rating + newReviews[review.hotel.hotel].count * newReviews[review.hotel.hotel].rating) / (newReviews[review.hotel.hotel].count + 1);
            newReviews[review.hotel.hotel].count += 1;
            newReviews[review.hotel.hotel].reviews.push(r);
        }
    })
    return newReviews;
}

const sortOnRating = (reviews) => {
    reviews.sort(function (a, b) {
        var keyA = a.rating,
            keyB = b.rating;
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return 0;
    });
    return reviews;
}

const getReview = async (req, res) => {
    let query = {};
    if (req.query.location)
        query = { ...query, location: req.query.location };
    if (req.query.hotel)
        query = { ...query, hotel: req.query.hotel };
    let reviews = await reviewModel.find(query).populate(['location', 'hotel']);
    if (reviews.length === 0) { 
        return res.status(200).json([]);
    }
    reviews = arrange(reviews);
    let reviewsArray = Object.values(reviews);
    reviewsArray = sortOnRating(reviewsArray);
    reviewsArray = reviewsArray.map(reviews => { reviews.reviews = sortOnRating(reviews.reviews); return reviews; });
    return res.status(200).send(reviewsArray);
}

const getLocation = async (req, res, next) => {
    let loc = req.query.location;
    if (loc == 'any') {
        req.query.location = null;
        return next();
    }
    loc = await locationModel.findOne({ location: loc });
    if (!loc) {
        return res.status(200).json([]);
    }
    req.query.location = loc._id;
    next();
}

const getHotel = async (req, res, next) => {
    let hotel = req.query.hotel;
    console.log(hotel);
    hotel = await hotelModel.findOne({ hotel: hotel });
    console.log(hotel);
    if (!hotel) {
        return res.status(200).json([]);
    }
    req.query.hotel = hotel._id;
    next();
}

const checkLocation = async (req, res, next) => {
    try {
        console.log(req.body);
        const location = req.body.location.toLowerCase();
        loc = await locationModel.findOne({ location: location });
        if (!loc) {
            const newlocation = locationModel({ location });
            await newlocation.save((err) => {
                if(err) {
                    console.log('error', err);
                    return res.status(500).send(err.message);
                }
                req.body.location = newlocation._id;
                next();
            });
        } else {
            req.body.location = loc._id;
            next();
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
}

const checkHotel = async (req, res, next) => {
    try {
        // req.body.hotel = req.body.hote.toLowerCase();
        const id = `${req.body.hotel.slice(0, 10)}_${req.body.location}`;
        const hotel = await hotelModel.findOne({ hotel_id: id });
        if (!hotel) {
            const newHotel = new hotelModel({ hotel: req.body.hotel, location: req.body.location, hotel_id: id });
            await newHotel.save((err, newHotel) => {
                if (newHotel) {
                    req.body.hotel = newHotel._id;
                    next();
                } else {
                    console.log('error', err);
                    return res.status(500).send(err.message);
                }
            });
        } else {
            req.body.hotel = hotel._id;
            next();
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
}

const postReview = async (req, res) => {
    try {
        const review = reviewModel({ ...req.body});
        await review.save((err, review) => {
            if (err) return res.status(500).send(err.message);
            return res.status(200).send(review);
        })
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

module.exports = { getReview, postReview, checkLocation, checkHotel, getLocation, getHotel, getHotels, getLocations };
