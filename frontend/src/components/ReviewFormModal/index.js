// frontend/src/components/ReviewFormModal/index.js
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {useModal} from "../../context/Modal";
import {thunkCreateReview, thunkClearReviews} from "../../store/reviews";
import StarInputRatings from "../StarInputRatings";
import "../../index.css";

export default function ReviewFormModal({spotId}) {
  const dispatch = useDispatch();
  const {closeModal} = useModal();
  const [revText, setRevText] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});


  const handleSubmit = (e) => {
    const revObj = {
      review: revText,
      stars: rating,
    };

    e.preventDefault();

    setErrors({});

    return dispatch(thunkCreateReview(spotId, revObj))
      .then(() => {
        dispatch(thunkClearReviews())
        return closeModal();
      })
      .catch(async (res) => {
        const data = await res.json();

        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const disableSubmit = () => {
    if (revText.length < 10 || rating === 0) return true;
  };

  const onChange = (number) => {
    setRating(parseInt(number));
  };

  const ulClassName = (disableSubmit ? " " : "action-button");

  return (
    <div className="review-modal-container">

      <h1>How was your stay?</h1>
      {errors.review && <p>{errors.review}</p>}
      {errors.stars && <p>{errors.stars}</p>}
      <form onSubmit={handleSubmit} className="review-form-container">
        <label>
          <textarea
            type="text"
            id="review-text-area"
            value={revText}
            placeholder="Leave your review here..."
            onChange={(e) => setRevText(e.target.value)}
          />
        </label>

        <div className="stars-container">
          <StarInputRatings
            disabled={false}
            onChange={onChange}
            rating={rating}
          />
        </div>

        <button type="submit" className={ulClassName} id="review-submit" disabled={disableSubmit()}>
          Submit Your Review
        </button>
      </form>
    </div>
  );
}
