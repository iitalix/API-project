// frontend/src/components/ReviewFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "../LoginFormModal/LoginForm.css";
import { thunkCreateReview } from "../../store/reviews";

function ReviewFormModal() {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrors({});
    return dispatch(thunkCreateReview(review))
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
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </label>

        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button type="submit">Submit Your Review</button>
      </form>
    </>
  );
}

export default ReviewFormModal;
