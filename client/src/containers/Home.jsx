import React, { useState } from 'react'
import { useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar'
import { images } from '../utils';
import './body.scss';

const Home = () => {
    const [imageIndex, setImageIndex] = useState(0)
    
    const updateImageIndex = () => {
        setImageIndex((prev) => (prev + 1) % images.length);
    }

    useEffect(() => {
        setInterval(updateImageIndex, 2000);
    }, []);
    
    return (
        <>
            <Navbar />
            <div className="body">
                <div className="image-slideshow">
                    {images.map((img, idx) => <img key={idx} className={idx === imageIndex ? 'visible' : 'not-visible'} src={img} />)}
                </div>
            </div>
        </>
    )
};

export default Home