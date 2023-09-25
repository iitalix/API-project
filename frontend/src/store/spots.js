// frontend/src/store/spots.js

// TYPES
const GET_SPOTS = "spots/getSpots";
const GET_SPOT_DETAILS = "spots/getSpot";

// ACTION CREATORS
const getSpots = (spots) => {
  return {
    type: GET_SPOTS,
    payload: spots,
  };
};

const getSpotDetails = (spot) => {
  return {
    type: GET_SPOT_DETAILS,
    payload: spot
  }
}

// THUNKS
export const thunkGetSpots = () => async (dispatch) => {
  const response = await fetch("/api/spots");

  const data = await response.json();
  dispatch(getSpots(data.Spots)); // gets passed to Action Creator
};

export const thunkGetSpotDetails = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}`);

  const data = await response.json();
  dispatch(getSpotDetails(data)); // gets passed to Action Creator
}

// REDUCER
const initialState = {
  data: [],
  spotDetails: {}
};

const spotsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_SPOTS:
      newState = Object.assign({}, state);
      newState.data = action.payload;
      return newState;
    case GET_SPOT_DETAILS:
      newState = Object.assign({}, state);
      newState.spotDetails = action.payload;
      return newState;
    default:
      return state;
  }
};

export default spotsReducer;
