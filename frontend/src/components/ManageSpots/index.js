//frontend/src/components/ManageSpot/index.js
import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {NavLink, useHistory, useParams} from "react-router-dom";
import {thunkGetSpotsCurrent} from "../../store/spots";
import SpotCard from "../SpotCard";

export default function ManageSpots() {
  const dispatch = useDispatch();
  const {push} = useHistory();
  const spots = useSelector((state) => state.spots.spotsCurrent);

  useEffect(() => {
    dispatch(thunkGetSpotsCurrent());
  }, []);

  const goToUpdateSpotForm = (spot) => {
    push(`/spots/edit/${spot.id}`);
    return;
  };

  const goToSpot = (spot) => {
    push(`/spots/${spot.id}`);
    return;
  };

  // TODO - NO SPOTS FOR CURRENT USER
  const showCreateSpotLink = () => {
    if (spots === undefined) {
      return (
        <>
          <NavLink to="/spots/new">Create A New Spot</NavLink>
        </>
      );
    }

    return;
  };

  return (
    <>
      <div className="manage-header">
        <h1>Manage Your Spots</h1>
        <button>Create a New Spot</button>
      </div>

      {showCreateSpotLink()}

      {spots.length && (
        <div className="manage-cards-container">
          {spots.map((spot) => (
            <>
              <div
                key={spot.id}
                className="spotcard"
                onClick={() => goToSpot(spot)}
              >
                <SpotCard spot={spot} />
              </div>

              <div className="manage-buttons-container">
                <button
                  onClick={() => goToUpdateSpotForm(spot)}
                  className="manage-buttons"
                >
                  Update
                </button>
                <button className="manage-buttons">Delete</button>
              </div>
            </>
          ))}
        </div>
      )}
    </>
  );
}
