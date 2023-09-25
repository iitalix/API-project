// frontend/src/store/reviews.js

// TYPES
const GET_REVIEWS = "reviews/getReviews";

// ACTION CREATORS
const getReviews = (reviews) => {
  return {
    type: GET_REVIEWS,
    payload: reviews,
  };
};

export const thunkGetReviews = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}/reviews`);

  const data = await response.json();
  dispatch(getReviews(data.Reviews)); // gets passed to Action Creator
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
    default:
      return state;
  }
};

export default reviewsReducer;
