// frontend/src/store/reviews.js

/* --TYPES-- */
const GET_REVIEWS = "reviews/getReviews";
const CREATE_REVIEW = "reviews/createReview";

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

/* --THUNKS-- */

// Get Reviews
export const thunkGetReviews = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}/reviews`);

  const data = await response.json();
  dispatch(getReviews(data.Reviews));
};

// Create Review
export const thunkCreateReview = (spotId, review) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(review),
  });

  const data = response.json();
  console.log("THUNK REVIEW DATA::", data);
  // dispatch(createReview(data))
};

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

    default:
      return state;
  }
};

export default reviewsReducer;
