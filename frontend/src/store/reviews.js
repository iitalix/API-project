// frontend/src/store/reviews.js
import {csrfFetch} from "./csrf";

/* --TYPES-- */
const GET_REVIEWS = "reviews/getReviews";
const CREATE_REVIEW = "reviews/createReview";
const DELETE_REVIEW = "reviews/deleteReview";
const CLEAR_REVIEWS = "reviews/clearReviews";

/* --ACTION CREATORS-- */
const getReviews = (reviews) => {
  return {
    type: GET_REVIEWS,
    payload: reviews,
  };
};

const createReview = (review) => {
  return {
    type: CREATE_REVIEW,
    payload: review,
  };
};

const deleteReview = (reviewId) => {
  return {
    type: DELETE_REVIEW,
    payload: reviewId
  }
}

const clearReviews = () => {
  return {
    type: CLEAR_REVIEWS,
  }
}


/* --THUNKS-- */

// Get Reviews
export const thunkGetReviews = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}/reviews`);

  const data = await response.json();
  dispatch(getReviews(data.Reviews));
};

// Create Review
export const thunkCreateReview = (spotId, review) => async (dispatch) => {

  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(review),
  });

  const data = await response.json();
  console.log("THUNK REV DATA", data)
  dispatch(createReview(data));
  return data;
};

// Delete Review
export const thunkDeleteReview = (reviewId) => async (dispatch) => {

  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });

  const data = response.json();
  dispatch(deleteReview(reviewId));
  return data;
};

// Clear Reviews
export const thunkClearReviews = () => async (dispatch) => {

  dispatch(clearReviews());
}

// REDUCER
const initialState = {
  Reviews: [],
};

const reviewsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_REVIEWS:
      newState = Object.assign({}, state);
      newState.Reviews = action.payload;
      return newState;

    case CREATE_REVIEW:
      newState = Object.assign({}, state);
      newState.Reviews.push(action.payload);
      console.log("NEW REV STATE", newState);
      return newState;

    case DELETE_REVIEW:
      newState = Object.assign({}, state);
      const filteredReviews = newState.Reviews.filter((review) => review.id !== action.payload);
      newState.Reviews = filteredReviews;
      return newState;

    case CLEAR_REVIEWS:
      newState = Object.assign({}, state);
      newState.Reviews = [];
      return newState;

    default:
      return state;
  }
};

export default reviewsReducer;
