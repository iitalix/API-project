// frontend/src/components/CreateSpotForm/index.js

import {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import "./CreateSpotForm.css";
import {thunkCreateSpot} from "../../store/spots";

export default function CreateSpotForm() {
  const {push} = useHistory();
  const dispatch = useDispatch();

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLatitude] = useState("");
  const [lng, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [validationObj, setValidationObj] = useState({});

  const errorsObj = {};
  // const handleErrors = () => {

  //   if (!country) {
  //     errorsObj.country = "Country is required"
  //   }
  //   if (!address) {
  //     errorsObj.address = "Address is required"
  //   }
  //   if (!city) {
  //     errorsObj.city = "City is required"
  //   }
  //   if (!state) {
  //     errorsObj.state = "State is required"
  //   }
  //   if (description.length < 30) {
  //     errorsObj.description = "Description needs a minimum of 30 characters"
  //   }
  //   if (!name) {
  //     errorsObj.name = "Name is required"
  //   }
  //   if (!price) {
  //     errorsObj.price = "Price is required"
  //   }
  //   if (!previewImage) {
  //     errorsObj.previewImage = "Preview image is required"
  //   }

  //   setValidationObj(errorsObj)
  //   return;
  // }

  // useEffect(() => {

  //   if (!country) {
  //     errorsObj.country = "Country is required";
  //   }
  //   if (!address) {
  //     errorsObj.address = "Address is required";
  //   }
  //   if (!city) {
  //     errorsObj.city = "City is required";
  //   }
  //   if (!state) {
  //     errorsObj.state = "State is required";
  //   }
  //   if (description.length < 30) {
  //     errorsObj.description = "Description needs a minimum of 30 characters";
  //   }
  //   if (!name) {
  //     errorsObj.name = "Name is required";
  //   }
  //   if (!price) {
  //     errorsObj.price = "Price is required";
  //   }
  //   if (!previewImage) {
  //     errorsObj.previewImage = "Preview image is required";
  //   }

  //   setValidationObj(errorsObj);
  // }, [country, address, city, state, description, name, price, previewImage]);

  const onSubmit = (e) => {
    e.preventDefault();

    // handleErrors();

    // const errorsArr = Object.values(errorsObj);

    // if (errorsArr.length > 0) {
    //   errorsArr.map((error) => <p className="errors">{error}</p>);
    //   return;
    // }

    const newSpot = {
      country,
      address,
      state,
      name,
      price,
      lat,
      lng,
      previewImage,
    };

    dispatch(thunkCreateSpot(newSpot));
    push("/");
  };

  return (
    <>
      <h1>Create a new Spot</h1>
      <h2>Where's your place located?</h2>
      <div>
        Guests will only get your exact address once they have booked a
        reservation.
      </div>

      <form className="spot-form" onSubmit={onSubmit}>
        <label>Country</label>
        <input
          type="text"
          name="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />

        {/* {validationObj.country && (
          <p className="errors">{validationObj.country}</p>
        )} */}

        <label>Street Address</label>
        <input
          type="text"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        {/* {validationObj.address && (
          <p className="errors">{validationObj.address}</p>
        )} */}

        <div>
          <label>City</label>
          <input
            type="text"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          {/* {validationObj.city && <p className="errors">{validationObj.city}</p>} */}

          <label>State</label>
          <input
            type="text"
            name="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>

        {/* {validationObj.state && <p className="errors">{validationObj.state}</p>} */}

        <div>
          <label>Latitude</label>
            <input
              type="text"
              name="latitude"
              value={lat}
              onChange={(e) => setLatitude(e.target.value)}
            />

            <label>Longitude</label>
            <input
              type="text"
              name="longitude"
              value={lng}
              onChange={(e) => setLongitude(e.target.value)}
            />
        </div>

        <h2>Describe your place to guests</h2>
        <div>
          Mention the best features of your space, any special amentities like
          fast wifi or parking, and what you love about the neighborhood.
        </div>
        <input
          type="text-area"
          name="description"
          placeholder="Please write at least 30 characters"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* {validationObj.description && (
          <p className="errors">{validationObj.description}</p>
        )} */}

        <h2>Create a title for your spot</h2>
        <div>
          Catch guests' attention with a spot title that highlights what makes
          your place special.
        </div>
        <input
          type="text"
          name="name"
          placeholder="Name of your spot"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* {validationObj.name && <p className="errors">{validationObj.name}</p>} */}

        <h2>Set a base price for your spot</h2>
        <div>
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </div>
        <p>
          {" "}
          $
          <input
            type="text"
            name="price"
            placeholder="Price per night (USD)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </p>

        {/* {validationObj.price && <p className="errors">{validationObj.price}</p>} */}

        <h2>Liven up your spot with photos</h2>
        <div>Submit a link to at least one photo to publish your spot.</div>
        <input
          type="text"
          name="preview-image"
          placeholder="Preview Image URL"
          onChange={(e) => setPreviewImage(e.target.value)}
        />

        {/* {validationObj.previewImage && (
          <p className="errors">{validationObj.previewImage}</p>
        )} */}

        <input type="text" name="name" placeholder="Image URL" />
        <input type="text" name="name" placeholder="Image URL" />
        <input type="text" name="name" placeholder="Image URL" />
        <input type="text" name="name" placeholder="Image URL" />

        <button type="submit">Create Spot</button>
      </form>
    </>
  );
}
