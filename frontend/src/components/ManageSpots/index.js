//frontend/src/components/ManageSpot/index.js
import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {thunkGetSpotsCurrent} from "../../store/spots";
import SpotCard from "../SpotCard";
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal";
import "../../index.css";

export default function ManageSpots() {
  const dispatch = useDispatch();
  const {push} = useHistory();
  const spots = useSelector((state) => state.spots.spotsCurrent);

  useEffect(() => {
    dispatch(thunkGetSpotsCurrent());
  }, []);

  const goToCreateSpotForm = () => {
    push("/spots/new");
    return;
  };

  const goToUpdateSpotForm = (spot) => {
    push(`/spots/edit/${spot.id}`);
    return;
  };

  const goToSpot = (spot) => {
    push(`/spots/${spot.id}`);
    return;
  };

  return (
    <div className="parent-container">
      <div className="manage-header">
        <h1>Manage Your Spots</h1>
        <button className="manage-buttons" onClick={() => goToCreateSpotForm()}>Create a New Spot</button>
      </div>

      {spots?.length > 0 && (
        <div className="manage-cards-container">
          {spots.map((spot) => (
            <div key="button-container" className="card-update-delete">
              <div
                key={spot.id}
                className="spotcard"
                onClick={() => goToSpot(spot)}
              >
                <SpotCard key={spot.id} spot={spot} />
              </div>

              <div className="manage-buttons-container">
                <button
                  onClick={() => goToUpdateSpotForm(spot)}
                  className="manage-buttons"
                >
                  Update
                </button>
                <div id="manage-modal-button">
                  <OpenModalButton
                    buttonText="Delete"
                    modalComponent={<DeleteSpotModal spotId={spot.id} />}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
