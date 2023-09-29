// frontend/src/components/UpdateSpotForm/index.js

import {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import {thunkGetSpotDetails, thunkUpdateSpot} from "../../store/spots";
import {thunkCreateSpotImage} from "../../store/spots";
import "../CreateSpotForm/CreateSpotForm.css";

export default function UpdateSpotForm() {
  const {push} = useHistory();
  const dispatch = useDispatch();
  const {spotId} = useParams();
  const details = useSelector((state) => state.spots.spotDetails);
  const images = useSelector((state) => state.spots.spotDetails.SpotImages);

  console.log("DETAILS:", details)
  console.log("IMAGES", images)

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  // const [lat, setLatitude] = useState(1.0);
  // const [lng, setLongitude] = useState(1.0);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  // const [previewImage, setPreviewImage] = useState("");
  // const [imgUrlOne, setImgUrlOne] = useState("");
  // const [imgUrlTwo, setImgUrlTwo] = useState("");
  // const [imgUrlThree, setImgUrlThree] = useState("");
  // const [imgUrlFour, setImgUrlFour] = useState("");
  const [validationObj, setValidationObj] = useState({});
  const [imageValidationObj, setImageValidationObj] = useState({});

  // const imageUrls = {
  //   previewImage,
  //   imgUrlOne,
  //   imgUrlTwo,
  //   imgUrlThree,
  //   imgUrlFour,
  // };

  useEffect(() => {
    dispatch(thunkGetSpotDetails(spotId));
    console.log("RUNNING GET CURR")
  }, []);

  useEffect(() => {
    console.log("RUNNING SET STATE")
    if (details) {
        setAddress(details.address)
        setCity(details.city)
        setState(details.state)
        setCountry(details.country)
        // setLatitude(details.lat)
        // setLongitude(details.lng)
        setName(details.name)
        setDescription(details.description)
        setPrice(details.price)
        // setPreviewImage(images[0].url)
        // setImgUrlOne(images[1].url)
        // setImgUrlTwo(images[2].url)
        // setImgUrlThree(images[3].url)
        // setImgUrlFour(images[4].url)
    }
  }, [
    details.address,
    details.city,
    details.state,
    details.country,
    details.lat,
    details.lng,
    details.name,
    details.description,
    details.price,
    // images[0].previewImage,
    // images[1].imgUrlOne,
    // images[2].imgUrlTwo,
    // images[3].imgUrlThree,
    // images[4].imgUrlFour
  ]);

  if (!details || Object.keys(details).length === 0) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    // imgErrCheck();

    const newSpot = {
      address,
      city,
      state,
      country,
      // lat,
      // lng,
      name,
      description,
      price,
    };

    const createSpot = await dispatch(thunkUpdateSpot(spotId, newSpot));
    // await addImages(createSpot);

    if (!createSpot.errors && !Object.keys(imageValidationObj).length)
      push(`/spots/${createSpot.id}`);

    setValidationObj(createSpot.errors);
  };

  // const imgErrCheck = () => {
  //   const imgErrObj = {};

  //   if (!previewImage) {
  //     imgErrObj.prevImg = "Preview image is required";
  //   }

  //   for (let key in imageUrls) {
  //     let ext = imageUrls[key];

  //     if (
  //       ext &&
  //       (!ext.endsWith(".png") ||
  //         !ext.endsWith(".jpg") ||
  //         !ext.endsWith(".jpeg"))
  //     ) {
  //       imgErrObj[key] = "Image URL must end in .png, .jpg, or .jpeg";
  //     }
  //   }

  //   setImageValidationObj(imgErrObj);
  // };

  // const addImages = async (createSpot) => {
  //   for (let key in imageUrls) {
  //     let spotImage = {};
  //     if (imageUrls[key] === previewImage) {
  //       spotImage = {
  //         url: imageUrls[key],
  //         preview: true,
  //       };
  //     } else {
  //       spotImage = {
  //         url: imageUrls[key],
  //         preview: false,
  //       };
  //     }

  //     await dispatch(thunkCreateSpotImage(createSpot.id, spotImage));
  //   }
  // };

  return (
    <>
      <h1>Update Your Spot</h1>
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

        {validationObj?.country && (
          <p className="errors">{validationObj?.country}</p>
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

        {/* <div>
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
        </div> */}

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
{/*
        <h2>Liven up your spot with photos</h2>
        <div>Submit a link to at least one photo to publish your spot.</div>
        <input
          type="text"
          name="preview-image"
          placeholder="Preview Image URL"
          value={previewImage}
          onChange={(e) => setPreviewImage(e.target.value)}
        />

        {imageValidationObj.prevImg && (
          <p className="errors">{imageValidationObj.prevImg}</p>
        )}

        {imageValidationObj.previewImage && (
          <p className="errors">{imageValidationObj.previewImage}</p>
        )}

        <input
          type="text"
          name="imgUrlOne"
          value={imgUrlOne}
          placeholder="Image URL"
          onChange={(e) => setImgUrlOne(e.target.value)}
        />

        {imageValidationObj.imgUrlOne && (
          <p className="errors">{imageValidationObj.imgUrlOne}</p>
        )}

        <input
          type="text"
          name="imgUrlTwo"
          value={imgUrlTwo}
          placeholder="Image URL"
          onChange={(e) => setImgUrlTwo(e.target.value)}
        />

        {imageValidationObj.imgUrlTwo && (
          <p className="errors">{imageValidationObj.imgUrlTwo}</p>
        )}

        <input
          type="text"
          name="imgUrlThree"
          value={imgUrlThree}
          placeholder="Image URL"
          onChange={(e) => setImgUrlThree(e.target.value)}
        />

        {imageValidationObj.imgUrlThree && (
          <p className="errors">{imageValidationObj.imgUrlThree}</p>
        )}

        <input
          type="text"
          name="imgUrlFour"
          value={imgUrlFour}
          placeholder="Image URL"
          onChange={(e) => setImgUrlFour(e.target.value)}
        />

        {imageValidationObj.imgUrlFour && (
          <p className="errors">{imageValidationObj.imgUrlFour}</p>
        )} */}

        <button type="submit">Update Your Spot</button>
      </form>
    </>
  );
}
