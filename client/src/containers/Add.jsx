import React from 'react'
import { useState } from 'react';
import AddReview from '../components/addReview/AddReview';
import Navbar from '../components/Navbar/Navbar'
import './body.scss';

const Add = () => {
    const [formValues, setFormValues] = useState({
        username: '',
        location: '',
        hotel: '',
        review: '',
        rating: 1,
        email: '',
    });
    return (
        <>
            <Navbar />
            <div className="body">
                <AddReview formValues={formValues} setFormValues={setFormValues} />
            </div>
        </>
    )
}

export default Add;