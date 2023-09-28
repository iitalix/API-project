//frontend/src/components/ManageSpot/index.js
import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {thunkGetSpotsCurrent} from "../../store/spots";
import SpotCard from "../SpotCard";

export default function ManageSpots() {
  const dispatch = useDispatch();
  const {push} = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const spots = useSelector((state) => state.spots.spotsCurrent);
  console.log("Manage Spots::", spots);

  useEffect(() => {
    dispatch(thunkGetSpotsCurrent(sessionUser.id));
  }, []);

  const goToSpot = (spot) => {
    push(`/spots/${spot.id}`);
    return;
  };



  return (
    <>
      <div className="manage-header">
        <h1>Manage Your Spots</h1>
        <button>Create a New Spot</button>
      </div>

      {spots.length && (
        <div className="manage-cards-container">
          {spots.map((spot) => (
            <div
              key={spot.id}
              className="spotcard"
              onClick={() => goToSpot(spot)}
            >
              <SpotCard spot={spot} />

              <div className="manage-buttons-container">
                <button className="manage-buttons">Update</button>
                <button className="manage-buttons">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
