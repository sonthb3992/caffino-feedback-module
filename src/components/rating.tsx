import React, { useEffect, useState } from 'react';
import './rating.css';

interface RatingProps {
  disabled?: boolean;
  fixedRating?: number;
  onRatingChanged?: (newRating: number) => void;
}

const Rating: React.FC<RatingProps> = ({
  disabled,
  fixedRating,
  onRatingChanged,
}) => {
  const [rating, setRating] = useState<number | null>(null);
  const [tempRating, setTempRating] = useState<number | null>(null);
  const [stars, setStars] = useState<boolean[]>([]);

  const rate = (_newRating: number) => {
    if (!disabled) {
      setRating(_newRating);
      if (tempRating === null) setTempRating(_newRating);
      if (onRatingChanged) onRatingChanged(_newRating);
    }
  };

  const starOver = (_newRating: number) => {
    if (!disabled) {
      if (tempRating === null) setTempRating(rating);
      setRating(_newRating);
    }
  };

  const starOut = () => {
    if (!disabled) {
      setRating(tempRating);
    }
  };

  useEffect(() => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (disabled && fixedRating) {
        stars.push(i <= fixedRating);
        continue;
      }
      if (!disabled && rating) {
        stars.push(i <= rating);
        continue;
      }
      stars.push(false);
    }
    setStars(stars);
  }, [rating, tempRating, fixedRating]);

  return (
    <div className="star-rating">
      {stars.length > 0 &&
        stars.map((selected, index) => (
          <label
            key={index}
            onClick={() => rate(index + 1)}
            className={`star-rating__star ${selected ? 'is-selected' : ''}`}
          >
            ★
          </label>
        ))}
    </div>
  );
};

export default Rating;
