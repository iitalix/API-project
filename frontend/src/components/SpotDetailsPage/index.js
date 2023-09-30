//frontend/src/components/SpotDetailPage/index.js

import {useSelector, useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {thunkGetSpotDetails} from "../../store/spots";
import {thunkGetReviews} from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import ReviewFormModal from "../ReviewFormModal";
import DeleteReviewModal from "../DeleteReviewModal";
import "../../index.css";

export default function SpotDetailsPage() {
  const dispatch = useDispatch();
  const {spotId} = useParams();
  const sessionUser = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots.spotDetails);
  const reviews = useSelector((state) => state.reviews.Reviews);

  console.log("SPOT IMAGES", spot);

  useEffect(() => {
    dispatch(thunkGetSpotDetails(spotId));
    dispatch(thunkGetReviews(spotId));
  }, [reviews]);

  if (!spot.id) return null;

  const resAlert = (e) => {
    e.preventDefault();
    alert("Feature coming soon!");
  };

  const convertDate = (date) => {
    let sampleDate = date.split(" ");
    sampleDate.splice(0, 1);
    sampleDate.splice(1, 1);

    return sampleDate.join(" ");
  };

  const showReviews = () => {
    return (
      spot.numReviews !== 0 && (
        <>
          <div>&middot;</div>
          <div>
            {spot.numReviews} {spot.numReviews > 1 ? "reviews" : "review"}
          </div>
        </>
      )
    );
  };

  const postFirstReview = () => {
    if (sessionUser) {
      if (spot.numReviews === 0 && sessionUser.id !== spot.ownerId) {
        return (
          <>
            <p>Be the first to post a review!</p>
            <OpenModalButton
              buttonText="Post Your Review"
              modalComponent={<ReviewFormModal spotId={spotId} />}
            />
          </>
        );
      }

      return;
    }
  };

  const postUserFirstReview = () => {
    if (sessionUser && sessionUser.id !== spot.ownerId) {
      let count = 0;
      reviews?.map((review) => {
        if (sessionUser.id === review.userId) count += 1;
      });

      if (!count) {
        return (
          <>
            <OpenModalButton
              buttonText="Post Your Review"
              modalComponent={<ReviewFormModal spotId={spotId} />}
            />
          </>
        );
      }
    }
  };

  const mainImage = spot.SpotImages.find((image) => image.preview === true);
  const fourImagesArr = spot.SpotImages.filter(
    (image) => image.preview === false
  );

  return (
    <div className="parent-container">
      <div>
        <h1>{spot.name}</h1>
        <h2>
          {spot.city}, {spot.state}, {spot.country}
        </h2>
      </div>
      <div id="images-container">
        <div className="main-image-container">
          <img src={mainImage.url} alt="interior room" id="main-image" />
        </div>
        <div id="side-image-container">
          {fourImagesArr.length > 0 &&
            fourImagesArr.map((image) => (
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

            {spot.numReviews > 0 && (
              <div className="callout-upper-right">
                <div>
                  <i className="fa-solid fa-star"></i>
                  {spot.avgRating}
                </div>
                {showReviews()}
              </div>
            )}

            {spot.numReviews === 0 && (
              <div className="callout-upper-right">
                <i className="fa-solid fa-star"></i>
                <div>New</div>
              </div>
            )}
          </div>

          <button onClick={resAlert} className="action-button reserve-button">Reserve</button>
        </div>
      </div>

      {/* only visible to logged-in User when Spot has no reviews */}
      {postFirstReview()}
      {/* {postUserFirstReview()} */}

      {/* only visible when Spot has reviews */}
      {spot.numReviews > 0 && (
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
            {/* only visible to Session User who has not reviewed Spot */}
            {postUserFirstReview()}
            {reviews?.map((review) => (
              <div>
                <div>
                  <div>{review.User.firstName}</div>
                  <div>{convertDate(review.createdAt)}</div>
                  <div>{review.review}</div>
                </div>
                {sessionUser && sessionUser.id === review.userId && (
                  <>
                    <OpenModalButton
                      buttonText="Delete"
                      modalComponent={
                        <DeleteReviewModal reviewId={review.id} />
                      }
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
