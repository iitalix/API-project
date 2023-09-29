// frontend/src/store/spots.js

import {csrfFetch} from "./csrf";

// TYPES
const GET_SPOTS = "spots/getSpots";
const GET_SPOT_DETAILS = "spots/getSpot";
const GET_SPOTS_CURRENT = "spots/getSpotsCurrent"
const GET_SPOT_IMAGES = "spots/getSpotImages"
const UPDATE_SPOT = "spots/updateSpot"

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
    payload: spot,
  };
};

const getSpotsCurrent = (spots) => {
  return {
    type: GET_SPOTS_CURRENT,
    payload: spots,
  }
}

// const updateSpot = (spot) => {
//   return {
//     type: UPDATE_SPOT,
//     payload: spot,
//   }
// }

/* --THUNKS-- */

// GET SPOTS
export const thunkGetSpots = () => async (dispatch) => {
  const response = await fetch("/api/spots");

  const data = await response.json();
  dispatch(getSpots(data.Spots));
};

// GET SPOTS CURRENT
export const thunkGetSpotsCurrent = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots/current");
  console.log("SPOTS CURR RESPONSE", response)

  try {

    if (response.ok) {

      const data = await response.json();
      dispatch(getSpotsCurrent(data.Spots))
      console.log("SPOTS CURR DATA", data)
    }

  } catch (error) {
    //!! Start
    const data = await response.json()
    return data;

    // !! End
    // return;
  }

}

// GET SPOT DETAILS
export const thunkGetSpotDetails = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);

  const data = await response.json();
  dispatch(getSpotDetails(data));
};

// CREATE SPOT
export const thunkCreateSpot = (spot) => async (dispatch) => {

  try {
    const response = await csrfFetch("/api/spots/", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(spot),
    });

    if (response.ok) {
      const newSpot = await response.json();
      return newSpot;
    }

  } catch (response) {

    const data = await response.json()
    return data;
  }
};

// CREATE SPOT IMAGE
export const thunkCreateSpotImage = (spotId, spotImage) => async (dispatch) => {

  try {

    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(spotImage),
    });

    const data = await response.json()
    return data;

  } catch (error) {

    const data = await error.json();
    return data;
  }

}

// UPDATE SPOT
export const thunkUpdateSpot = (spotId, spot) => async (dispatch) => {

  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(spot),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }

  } catch (response) {

    const data = await response.json()
    console.log("BAD REQUEST DATA", data)
    return data;
  }
};

// REDUCER
const initialState = {
  allSpots: [],
  spotDetails: {},
  spotsCurrent: [],
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

    case GET_SPOTS_CURRENT:
      newState = Object.assign({}, state);
      newState.spotsCurrent = action.payload;
      return newState;

    default:
      return state;
  }

};

export default spotsReducer;
