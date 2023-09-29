// frontend/src/components/ReviewFormModal/index.js
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {useModal} from "../../context/Modal";
import {thunkCreateReview} from "../../store/reviews";
import StarInputRatings from "../StarInputRatings";
import "../LoginFormModal/LoginForm.css";

export default function ReviewFormModal({spotId}) {
  const dispatch = useDispatch();
  const {closeModal} = useModal();
  const [revText, setRevText] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState({});
  const [errors, setErrors] = useState({});

  console.log("MODAL ERRORS", errors)

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
          setErrors(data.message);
        }
      });
  };

  const onChange = (number) => {
    setRating(parseInt(number));
  };

  return (
    <>
      <h1>How was your stay?</h1>
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

        {/* {errors.credential && (
          <p>{errors.credential}</p>
        )} */}

        {/* {errors.message && <p>{errors.message}</p>} */}
        <button type="submit">Submit Your Review</button>
      </form>
    </>
  );
}
