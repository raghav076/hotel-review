import React from 'react'
import { useNavigate } from 'react-router-dom';
import "./Navbar.scss";

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <div className="navbar">
            <div onClick={()=>{navigate('/')}} className="navbar-logo">
                Review Hotels
            </div>
            <ul className="navbar-menu">
                <li onClick={()=>{navigate('/add')}}>Add a Review</li>
                <li onClick={()=>{navigate('/search?location=any')}}>Search Best Hotels</li>
            </ul>
        </div>
    )
}

export default Navbar