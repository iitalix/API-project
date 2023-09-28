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
  const [imgUrlOne, setImgUrlOne] = useState("");
  const [imgUrlTwo, setImgUrlTwo] = useState("");
  const [imgUrlThree, setImgUrlThree] = useState("");
  const [imgUrlFour, setImgUrlFour] = useState("");
  const [validationObj, setValidationObj] = useState({});
  const [imageValidObj, setImageValidObj] = useState({});

  const imgErrObj = {};
  const imageUrls = {
    imgUrlOne,
    imgUrlTwo,
    imgUrlThree,
    imgUrlFour,
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    imgErrCheck();

    const newSpot = {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    };

    const createSpot = await dispatch(thunkCreateSpot(newSpot));
    if (!createSpot.errors && Object.keys(imageValidObj).length > 0) push("/");

    setValidationObj(createSpot.errors);
  };

  const imgErrCheck = () => {
    if (!previewImage) {
      imgErrObj.prevImg = "Preview image is required";
    }

    for (let key in imageUrls) {
      let ext = imageUrls[key];

      if (
        ext &&
        (!ext.endsWith(".png") ||
          !ext.endsWith(".jpg") ||
          !ext.endsWith(".jpeg"))
      ) {
        imgErrObj[key] = "Image URL must end in .png, .jpg, or .jpeg";
      }
    }

    setImageValidObj(imgErrObj);
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

        {validationObj.country && (
          <p className="errors">{validationObj.country}</p>
        )}

        <label>Street Address</label>
        <input
          type="text"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        {validationObj.address && (
          <p className="errors">{validationObj.address}</p>
        )}

        <div>
          <label>City</label>
          <input
            type="text"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          {validationObj.city && <p className="errors">{validationObj.city}</p>}

          <label>State</label>
          <input
            type="text"
            name="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>

        {validationObj.state && <p className="errors">{validationObj.state}</p>}

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

        {validationObj.description && (
          <p className="errors">{validationObj.description}</p>
        )}

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

        {validationObj.name && <p className="errors">{validationObj.name}</p>}

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

        {validationObj.price && <p className="errors">{validationObj.price}</p>}

        <h2>Liven up your spot with photos</h2>
        <div>Submit a link to at least one photo to publish your spot.</div>
        <input
          type="text"
          name="preview-image"
          placeholder="Preview Image URL"
          value={previewImage}
          onChange={(e) => setPreviewImage(e.target.value)}
        />

        {imageValidObj.prevImg && (
          <p className="errors">{imageValidObj.prevImg}</p>
        )}

        <input
          type="text"
          name="imgUrlOne"
          value={imgUrlOne}
          placeholder="Image URL"
          onChange={(e) => setImgUrlOne(e.target.value)}
        />

        {imageValidObj.imgUrlOne && (
          <p className="errors">{imageValidObj.imgUrlOne}</p>
        )}

        <input
          type="text"
          name="imgUrlTwo"
          value={imgUrlTwo}
          placeholder="Image URL"
          onChange={(e) => setImgUrlTwo(e.target.value)}
        />

        {imageValidObj.imgUrlTwo && (
          <p className="errors">{imageValidObj.imgUrlTwo}</p>
        )}

        <input
          type="text"
          name="imgUrlThree"
          value={imgUrlThree}
          placeholder="Image URL"
          onChange={(e) => setImgUrlThree(e.target.value)}
        />

        {imageValidObj.imgUrlThree && (
          <p className="errors">{imageValidObj.imgUrlThree}</p>
        )}

        <input
          type="text"
          name="imgUrlFour"
          value={imgUrlFour}
          placeholder="Image URL"
          onChange={(e) => setImgUrlFour(e.target.value)}
        />

        {imageValidObj.imgUrlFour && (
          <p className="errors">{imageValidObj.imgUrlFour}</p>
        )}

        <button type="submit">Create Spot</button>
      </form>
    </>
  );
}
