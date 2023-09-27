// frontend/src/components/LandingPage/index.js

import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {thunkGetSpots} from "../../store/spots";
import { thunkGetSpotDetails } from "../../store/spots";
import SpotCard from "../SpotCard";
import "./LandingPage.css";

export default function LandingPage() {
  const {push} = useHistory();
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.allSpots);

  useEffect(() => {
    dispatch(thunkGetSpots());

  }, []);

  const goToSpot = (spot) => {
    push(`/spots/${spot.id}`);
    return;
  };

  return (
    <div className="spotcards-container">
      <div className="spot-cards">
        {spots.map((spot) => (
          <div
            key={spot.id}
            className="spotcard"
            onClick={() => goToSpot(spot)}
          >
            <SpotCard spot={spot} />
          </div>
        ))}
      </div>
    </div>
  );
}
