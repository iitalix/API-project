import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {useModal} from "../../context/Modal";
import {thunkDeleteReview} from "../../store/reviews";
import "../../index.css";

export default function DeleteReviewModal({reviewId}) {
  const dispatch = useDispatch();
  const {closeModal} = useModal();
  const [errors, setErrors] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrors({});

    return dispatch(thunkDeleteReview(reviewId))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();

        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className="delete-review-modal-container">
      <h1>Confirm Delete</h1>
      <div>Are you sure you want to delete this review?</div>

      <div id="confirm-buttons">
        <button
          className="action-button"
          id="delete-review-modal-button"
          onClick={handleSubmit}
        >
          Yes (Delete Review)
        </button>

        <button id="keep-review" onClick={closeModal}>
          No (Keep Review)
        </button>
      </div>
    </div>
  );
}
