// frontend/src/components/LandingPage/index.js

import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {thunkGetSpots} from "../../store/spots";
import SpotCard from "../SpotCard";
import "./LandingPage.css"

export default function LandingPage() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.data);

  useEffect(() => {
    dispatch(thunkGetSpots());
  }, []);

  return (
    <div className="spotcards-container">
      <div className="spot-cards">
        {spots.map((spot) => (
            <div key={spot.id} className="spotcard">
                <SpotCard spot={spot}/>
            </div>

        ))}
      </div>
    </div>
  );
}
