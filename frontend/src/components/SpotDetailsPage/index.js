//frontend/src/components/SpotDetailPage/index.js

import {useSelector, useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {thunkGetSpotDetails} from "../../store/spots";
import "./SpotDetailsPage.css";
import {useEffect} from "react";

export default function SpotDetailsPage() {
  const dispatch = useDispatch();
  const {spotId} = useParams();
  const spot = useSelector((state) => state.spots.spotDetails);

  useEffect(() => {
    dispatch(thunkGetSpotDetails(spotId));
  }, []);

  if (!spot.id) return null;

  // TODO: NOT WORKING
  function resAlert(e) {

    e.preventDefault();
    alert("Feature coming soon!")
  }

  const fourImagesArr = spot.SpotImages.slice(1);
  return (
    <>
      <div>
        <h1>{spot.name}</h1>
        <h2>
          {spot.city}, {spot.state}, {spot.country}
        </h2>
      </div>
      <div id="images-container">
        <div>
          <img
            src={spot.SpotImages[0].url}
            alt="interior room"
            id="main-image"
          />
        </div>
        <div id="side-image-container">
          {fourImagesArr.map((image) => (
            <img
              src={image.url}
              alt="interior room"
              className="side-image"
              key={image.id}
            />
          ))}
        </div>
      </div>
      <div id="spot-info-container">
        <div id="spot-description">
          <div id="host-info">
            Hosted by {spot.User.firstName} {spot.User.lastName}
          </div>
          <div>{spot.description}</div>
        </div>
        <div id="callout-box">

            <div id="callout-box-upper">
              <div>{`$${spot.price} night`}</div>
              <div>
                <i className="fa-solid fa-star"></i>
                {spot.avgRating}
                <div>{spot.numReviews} reviews</div>
            </div>

        </div>
          <button onclick={resAlert}>Reserve</button>
        </div>
      </div>
    </>
  );
}
