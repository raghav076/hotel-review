import React, { useState ,useEffect } from 'react'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddValue from '../components/addValue/AddValue';
import Navbar from '../components/Navbar/Navbar'
import { images } from '../utils';
import './Search.scss';

// const image = "https://pix10.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg?ca=6&ce=1&s=1024x768";

const SearchBar = ({location, setLocation, locations, hotel, setHotel, hotels}) => {
    return (
        <div className="search-bar">
            <AddValue type="Location" value={location} setValue={setLocation} options={locations} addValue={false} required={false} />
            <AddValue type="Hotel" value={hotel} setValue={setHotel} options={hotels} disabled={!location} addValue={false} required={false} />
        </div>
    )
}

const Search = () => {
    const [location, setLocation] = useState('');
    const [hotel, setHotel] = useState('');
    const [locations, setLocations] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [review, setReview] = useState([]);
    const [more, setMore] = useState(false);

    useEffect(() => {
        const getLocations = async () => {
            const l = await fetch('http://localhost:8080/locations').then((res) => res.json());
            setLocations(l);
        }
        getLocations();
    }, []);

    useEffect(() => {
        setHotel('');
        const getHotels = async () => {
            const h = await fetch(`http://localhost:8080/hotels?location=${location.toLowerCase()}`).then((res) => res.json());
            console.log(h);
            setHotels(h);
        }
        location && getHotels();
    }, [location]);

    useEffect(() => {
        setMore(0);
        setReview([]);
        const getReviews = async (loc) => {
            const r = await fetch(`http://localhost:8080/reviews?location=${loc.toLowerCase()}`).then((res) => res.json());
            console.log(r);
            setReview(r);
        }

        if (location) {
            if (hotel) {
                const getReview = async () => {
                    const r = await fetch(`http://localhost:8080/review?location=${location.toLowerCase()}&hotel=${hotel}`).then((res) => res.json());
                    console.log(r);
                    setReview(r);
                }
                getReview();
            } else {
                getReviews(location);
            }
        } else {
            getReviews('any');
        }
    }, [location, hotel]);

    const getLocations = (arr) => {
        const loc = arr.map((a) => a.location);
        let unique = loc.filter((item, i, ar) => ar.indexOf(item) === i);
        return (
            <div className="locations">
                Location(s): {unique.map((a, idx) => <span key={idx} className="item">{a}</span>)}
            </div>
        )
    }

    const getReview = (review) => {
        return (
            <div className="review">
                <div className="heading">
                    User: {review.username} | {' '}
                    Location: {review.location} | {' '}
                    Rating: {review.rating}<StarOutlinedIcon className="star" />
                </div>
                <div className="content">
                    {review.review}
                </div>
            </div>
        )
    }

    return (
        <>
            <Navbar />
            <div className="body">
                <div className="form-group" >
                    <SearchBar location={location} setLocation={setLocation} locations={locations} hotel={hotel} setHotel={setHotel} hotels={hotels} />
                    <div className="all-hotels">
                        {review.map((a, idx) => {
                            return (
                                <div key={idx}>
                                    <div className="hotel">
                                        <div className="image-container">
                                            <img src={images[idx]} />
                                            <span className="rank">
                                                Rank: #{idx + 1}
                                                <span className="hotel-rating">
                                                    {Math.round(a.rating * 100) / 100} <StarOutlinedIcon className="star" /> ({a.count})
                                                </span>
                                            </span>
                                        </div>
                                        <div className="hotel-info">
                                            <div className="title">
                                                {a.hotel}
                                            </div>
                                            {getLocations(a.reviews)}
                                            {a.reviews[0] && <div className="top-review">
                                                <span className="title">Top Review</span>
                                                {getReview(a.reviews[0])}
                                            </div>}
                                        </div>
                                        <div className="view-all">
                                            <span>All Reviews</span>
                                            <span onClick={() => more === idx + 1 ? setMore(0) : setMore(idx + 1)}>{more === idx + 1 ? <ExpandLessIcon className="expand" /> : <ExpandMoreIcon className="expand" />}</span>
                                        </div>
                             
                        
                                    </div>
                                    <div className={`all-reviews ${more === idx + 1 ? "show" : "hide"}`}>
                                        {a.reviews.map((a, idx) =>
                                            <div key={idx} >{getReview(a)}</div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
};

export default Search