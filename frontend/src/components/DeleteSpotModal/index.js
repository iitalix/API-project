// frontend/src/components/ReviewFormModal/index.js
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {useModal} from "../../context/Modal";
import { thunkDeleteSpot } from "../../store/spots";
import "../../index.css"

export default function DeleteSpotModal({spotId}) {
  const dispatch = useDispatch();
  const {closeModal} = useModal();
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrors({});

    return dispatch(thunkDeleteSpot(spotId))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();

        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div id="delete-spot-modal-container">
      <h1>Confirm Delete</h1>
      <div>Are you sure you want to remove this spot from the listings?</div>
      <button id="delete-spot-modal-button" className="action-button" onClick={handleSubmit}>Yes (Delete Spot)</button>
      <button id="keep-spot" onClick={closeModal}>No (Keep Spot)</button>
    </div>
  );
}
