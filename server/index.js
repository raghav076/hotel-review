require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const { getReview, postReview, checkLocation, checkHotel, getLocation, getHotel, getHotels, getLocations } = require('./controller/review');

const app = express();

const MONGO_URI = `mongodb+srv://${process.env.mongo_user_name}:${process.env.mongo_password}@cluster0.9zxbavp.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        console.log(err);
    }
    else console.log('connected to DB!');
})

const corsOption = {
    origin: '*',
    optionSuccessStatus: 200,
};

app.use(cors(corsOption));

const jsonParser = bodyParser.json();
app.use(jsonParser);

const server = http.createServer(app);

app.get('/', (req, res) => {
    res.status(200).send('Raghav is The King');
});

app.get('/review', getLocation, getHotel, getReview);
app.get('/reviews', getLocation, getReview);
app.post('/review',  checkLocation, checkHotel, postReview);
app.get('/locations', getLocations);
app.get('/hotels', getLocation, getHotels);

const port = process.env.PORT || 8080;

server.listen(port, () => {
    console.log('server running at ' + port);
});
