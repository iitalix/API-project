// frontend/src/store/spots.js

// TYPES
const GET_SPOTS = "spots/getSpots";
const GET_SPOT_DETAILS = "spots/getSpot";
const CREATE_SPOT = "spots/createSpot"

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

const createSpot = (form) => {
  return {
    type: CREATE_SPOT,
    payload: form
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

export const thunkCreateSpot = (spot) => async (dispatch) => {
  const res = await fetch('/api/spots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spot),
  });

  if (res.ok) {
    const newSpot = await res.json();
    dispatch(createSpot(newSpot));
    return newSpot;
  } else {
    const errors = await res.json();
    return errors;
  }
};

// REDUCER
const initialState = {
  allSpots: [],
  spotDetails: {}
};

const spotsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_SPOTS:
      newState = Object.assign({}, state);
      newState.allSpots = action.payload;
      return newState;
    case GET_SPOT_DETAILS:
      newState = Object.assign({}, state);
      newState.spotDetails = action.payload;
      return newState;
    case CREATE_SPOT:
      newState = Object.assign({}, state);
      newState.spotDetails = action.payload;
    default:
      return state;
  }
};

export default spotsReducer;
