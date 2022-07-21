import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import AddValue from '../addValue/AddValue';
import './AddReview.scss';
import RatingStars from '../ratingStars/RatingStars';

const AddReview = ({ formValues, setFormValues }) => {
    const [location, setLocation] = useState('');
    const [hotel, setHotel] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [locations, setLocations] = useState([]);
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        const getLocations = async () => {
            const l = await fetch('http://localhost:8080/locations').then((res) => res.json());
            setLocations(l);
        }
        getLocations();
    }, []);

    useEffect(() => {
        const getHotels = async () => {
            const h = await fetch(`http://localhost:8080/hotels?location=${location.toLowerCase()}`).then((res) => res.json());
            console.log(h);
            setHotels(h);
        }
        location && getHotels();
    }, [location]);

    useEffect(() => {
        if (location) {
            updateFormValues('location', location);
        }
        if (hotel) {
            updateFormValues('hotel', hotel);
        }
    }, [location, hotel])
    

    const updateFormValues = (key, value) => {
        setFormValues((prev) => {
            return { ...prev, [key]: value }
        })
    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(formValues.email)) {
            setEmailError(true);
        } else setEmailError(false);
        const res = await fetch('http://localhost:8080/review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formValues)
        });
        console.log('post', res);
    }

    return (
        <form className="form-control" onSubmit={handleSubmit}>
            <h1 className="form-group">Add Review</h1>
            <div className="form-group">
                <TextField
                    required
                    id="standard-required"
                    label="Full Name"
                    variant="standard"
                    className="form-input"
                    value={formValues.username}
                    onChange={(e) => updateFormValues('username', e.target.value)}
                />
                
                <TextField
                    required
                    id="standard-required"
                    label="Email"
                    variant="standard"
                    className="form-input"
                    error={emailError}
                    helperText={emailError ? 'Please enter a valid email' : ''}
                    value={formValues.email}
                    onChange={(e) => updateFormValues('email', e.target.value)}
                />
            </div>
            <div className="form-group">
                <AddValue type="Location" value={location} setValue={setLocation} options={locations} />
                <AddValue type="Hotel" value={hotel} setValue={setHotel} options={hotels} disabled={!formValues.location} />
            </div>
            <div className="form-group">
                <RatingStars count={7} values={formValues} setValues={setFormValues} />
                {/* <RatingStars count={7} values={formValues} setValues={setFormValues} /> */}
                <TextareaAutosize
                    required
                    className="form-input"
                    aria-label="minimum height"
                    minRows={5}
                    placeholder="Add your Review *"
                    style={{ maxWidth: '39%', minWidth: '39%', padding: '0.5%'}}
                    value={formValues.review}
                    onChange={(e) => updateFormValues('review', e.target.value)}

                />
            </div>
            <div className="form-group">
                <button className="submit" type="submit">Submit</button>
            </div>
        </form>
    )
}
    
export default AddReview