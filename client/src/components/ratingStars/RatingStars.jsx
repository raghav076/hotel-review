import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import './RatingStars.scss';

const RatingStars = (props) => {
  const { count, values, setValues } = props;
  const [stars, setStars] = useState([]);
  const [value, setValue] = useState(values.rating);

  useEffect(() => {
    setValues((prev) => { return { ...prev, rating: value } });
    setStars((prev) => []);
    for (let i = 0; i < value; i++) {
      setStars((prev) => [...prev, { icon: StarOutlinedIcon, outline: true }])
    }
    for (let i = value; i < count; i++) {
      setStars((prev) => [...prev, { icon: StarBorderOutlinedIcon, outline: false }])
    }
  }, [value]);
  
  return (
    <div className="star-div form-input">
      Rating:
      <div className="star-container">
        {stars.map((a, idx) =>
          <a.icon onClick={() => { setValue(idx + 1) }} className={`star star-${a.outline ? 'outline' : 'border'}`} key={idx} />
        )}
      </div>
    </div>
  )
}

PropTypes.defaultValues = {
    count: 5
}

export default RatingStars