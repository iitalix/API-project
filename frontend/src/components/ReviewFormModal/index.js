// frontend/src/components/ReviewFormModal/index.js
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {useModal} from "../../context/Modal";
import {thunkCreateReview} from "../../store/reviews";
import StarInputRatings from "../StarInputRatings";
import "../LoginFormModal/LoginForm.css";

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
      .then(closeModal)
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

  return (
    <div className="review-modal-container">
      <h1>How was your stay?</h1>
      {errors.review && <p>{errors.review}</p>}
      {errors.stars && <p>{errors.stars}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text-area"
            value={revText}
            placeholder="Leave your review here..."
            onChange={(e) => setRevText(e.target.value)}
          />
        </label>

        <StarInputRatings
          disabled={false}
          onChange={onChange}
          rating={rating}
        />

        <button type="submit" disabled={disableSubmit()}>Submit Your Review</button>
      </form>
    </div>
  );
}
