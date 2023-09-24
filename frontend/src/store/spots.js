// frontend/src/store/spots.js

import {csrfFetch} from "./csrf";

// TYPES
const GET_SPOTS = "spots/getSpots";

// ACTION CREATORS
const getSpots = (spots) => {
  return {
    type: GET_SPOTS,
    payload: spots,
  };
};

// THUNKS
export const thunkGetSpots = () => async (dispatch) => {
  const response = await fetch("api/spots");

  const data = await response.json();
  dispatch(getSpots(data.Spots));
};

// REDUCER
const initialState = {data: []};

const spotsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_SPOTS:
      newState = Object.assign({}, state);
      newState.data = action.payload;
      return newState;
    default:
      return state;
  }
};

export default spotsReducer;
