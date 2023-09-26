//frontend/src/components/SpotDetailPage/index.js

import {useSelector, useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {thunkGetSpotDetails} from "../../store/spots";
import {thunkGetReviews} from "../../store/reviews";
import "./SpotDetailsPage.css";

export default function SpotDetailsPage() {
  const dispatch = useDispatch();
  const {spotId} = useParams();
  const sessionUser = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots.spotDetails);
  const reviews = useSelector((state) => state.reviews.Reviews);

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
    let sampleDate = date.split(" ");
    sampleDate.splice(0, 1);
    sampleDate.splice(1, 1);

    return sampleDate.join(" ");
  }

  function showReviews() {
    return (
      spot.numReviews !== 0 ? (
        <>
          <div>&middot;</div>
          <div>
            {spot.numReviews} {spot.numReviews > 1 ? "reviews" : "review"}
          </div>
        </>
      ) : (<div>New</div>)
    );
  }

  function beFirstReview() {

    if (!spot.numReviews.length && sessionUser.id !== spot.ownerId){

      return (

        <p>Be the first to post a review!</p>

      )
    }

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
              {showReviews()}
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
            {showReviews()}
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
