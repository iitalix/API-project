//frontend/src/components/SpotDetailPage/index.js

import {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useParams} from 'react-router-dom'
import { thunkGetSpotDetails } from "../../store/spots";

export default function SpotDetailsPage() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  // key into reducer/storeshape
  const spot = useSelector((state) => state.spots.spotDetails);
  const image = spot.SpotImages[0].url

  useEffect(() => {
    dispatch(thunkGetSpotDetails(spotId));
  }, [dispatch, spotId]);

  console.log("SPOT::", spot)
  return (
    <>
      <div>
        <h1>{spot.name}</h1>
        <h2>{spot.city}, {spot.state}, {spot.country}</h2>
      </div>
      <div id="images-container">
        <img src={image} alt="room image"/>
      </div>
      <div>
        <div>
          <div>Hosted by {spot.User.firstName} {spot.User.lastName}</div>
          <div>{spot.description}</div>
        </div>
      </div>
    </>

  )

}
