// frontend/src/components/ReviewFormModal/index.js
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import { useParams } from "react-router-dom";
import {useModal} from "../../context/Modal";
import {thunkCreateReview} from "../../store/reviews";
import StarInputRatings from "../StarInputRatings";
import "../LoginFormModal/LoginForm.css";

export default function ReviewFormModal() {
  const dispatch = useDispatch();
  const {closeModal} = useModal();
  const {spotId} = useParams();
  const [revText, setRevText] = useState("");
  const [revStars, setRevStars] = useState(0);
  const [review, setReview] = useState({});
  const [errors, setErrors] = useState({});

  const revObj = {
    review: revText,
    stars: revStars
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    setReview(revObj);
    setErrors({});

    return dispatch(thunkCreateReview(spotId, review))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <>
      <h1>How was your stay?</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text-area"
            value={review}
            placeholder="Leave your review here..."
            onChange={(e) => setRevText(e.target.value)}
            required
          />
        </label>

        <StarInputRatings
          disabled={false}
          onChange={onChange}
          revStars={revStars} />
        {/* {errors.credential && (
          <p>{errors.credential}</p>
        )} */}
        <button type="submit">Submit Your Review</button>
      </form>
    </>
  );
}
