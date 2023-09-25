//frontend/src/components/SpotDetailPage/index.js

import {useSelector, useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {thunkGetSpotDetails} from "../../store/spots";
import { thunkGetReviews } from "../../store/reviews";
import "./SpotDetailsPage.css";

export default function SpotDetailsPage() {
  const dispatch = useDispatch();
  const {spotId} = useParams();
  const spot = useSelector((state) => state.spots.spotDetails);
  const reviews = useSelector((state) => state.reviews.Reviews);
  console.log("REVIEWS", reviews)

  useEffect(() => {
    dispatch(thunkGetSpotDetails(spotId));
    dispatch(thunkGetReviews(spotId));
  }, []);

  if (!spot.id) return null;

  function resAlert(e) {
    e.preventDefault();
    alert("Feature coming soon!");
  }

  function convertDate(date) {

    let sampleDate = (date).split(" ");
    sampleDate.splice(0,1);
    sampleDate.splice(1,1);

    return sampleDate.join(" ")
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

        <div className="callout-box">
          <div className="callout-box-upper">
            <div>{`$${spot.price} night`}</div>
            <div className="callout-upper-right">
              <div>
                <i className="fa-solid fa-star"></i>
                {spot.avgRating}
              </div>
              <div>&middot;</div>
              <div>{spot.numReviews} reviews</div>
            </div>
          </div>
          <button onClick={resAlert}>Reserve</button>
        </div>
      </div>

      <div id="reviews-container">
        <div className="callout-box-upper" id="reviews-header">
          <div className="callout-upper-right reviews-header">
            <div>
              <i className="fa-solid fa-star"></i>
              {spot.avgRating}
            </div>
            <div>&middot;</div>
            <div>
            {spot.numReviews ? 1 <div>1 review</div> : <div>{spot.numReviews} reviews</div>}

            </div>
          </div>
        </div>

        <div className="reviews">
            {reviews.map((review) => (
              <div>
                <div>{review.User.firstName}</div>
                <div>{convertDate(review.createdAt)}</div>
                <div>{review.review}</div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
