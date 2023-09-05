// backend/routes/api/spots
const express = require("express");
const router = require("express").Router();

const {requireAuth} = require("../../utils/auth.js");
const {check} = require("express-validator");
const {handleValidationErrors} = require("../../utils/validation");
const {Spot, Review, ReviewImage, SpotImage, User} = require("../../db/models");

/* -- SPOTS -- */

const validateSpotEdit = [
  check("address")
    .exists({checkFalsy: true})
    .withMessage("Street address is required."),
  check("city").exists({checkFalsy: true}).withMessage("City is required."),
  check("state").exists({checkFalsy: true}).withMessage("State is required."),
  check("country")
    .exists({checkFalsy: true})
    .withMessage("Country is required."),
  check("lat")
    .exists({checkFalsy: true})
    .isDecimal({force_decimal: true})
    .withMessage("Latitude is not valid."),
  check("lng")
    .exists({checkFalsy: true})
    .isDecimal({force_decimal: true})
    .withMessage("Longitude is not valid."),
  check("name")
    .exists({checkFalsy: true})
    .isLength({max: 49})
    .withMessage("Name must be less than 50 characters."),
  check("description")
    .exists({checkFalsy: true})
    .withMessage("Description is required."),
  check("price")
    .exists({checkFalsy: true})
    .withMessage("Price per day is required."),
  handleValidationErrors,
];

// GET all Spots - done!
router.get("/", async (req, res) => {
  const allSpots = await Spot.findAll({
    include: [
      {
        model: Review,
      },
      {
        model: SpotImage,
      },
    ],
  });

  let spotsList = [];
  allSpots.forEach((spot) => {
    spotsList.push(spot.toJSON());
  });

  spotsList.forEach((spot) => {
    spot.Reviews.forEach((review) => {
      spot.avgRating = review.stars;
    });

    spot.SpotImages.forEach((image) => {
      if (image.preview === true) {
        spot.previewImage = image.url;
      }
    });

    delete spot.Reviews;
    delete spot.SpotImages;
  });

  return res.json(spotsList);
});

// GET details for a Spot from an id - done!
router.get("/:spotId", async (req, res) => {
  let findSpot = await Spot.findByPk(req.params.spotId, {
    include: [
      {
        model: Review,
      },
      {
        model: SpotImage,
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });

  if (!findSpot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found.",
    });
  }

  findSpot = findSpot.toJSON();

  let numReviews = findSpot.Reviews.length;
  let avgRating;
  findSpot.Reviews.forEach((review) => {
    avgRating = review.stars;
  });

  delete findSpot.Reviews;

  return res.json({
    ...findSpot,
    avgRating,
    numReviews,
  });
});

// GET all spots from Current User - in progress
router.get("/current", requireAuth, async (req, res) => {
  const {user} = req;
  console.log(user);

  current = user.id;

  const userSpots = await Spot.findAll({
    include: [
      {
        model: User,
      },
    ],

    where: {
      ownerId: current,
    },
  });

  return res.json(userSpots);
});

// Edit a Spot - done, with questions:
// How precise is error-checking supposed to be?
// How do we handle unauthorized user?
router.put("/:spotId", requireAuth, validateSpotEdit, async (req, res) => {
  const editSpot = await Spot.findByPk(req.params.spotId, {
    include: [
      {
        model: User,
        attributes: ["id"],
      },
    ],
  });

  const {user} = req;
  const {address, city, state, country, lat, lng, name, description, price} =
    req.body;

  // If Spot does not exist
  if (!editSpot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found.",
    });
  }

  // Only Owner is authorized to edit
  let spotObj = editSpot.toJSON();
  if (user.id !== spotObj.User.id) {
    res.status(401);
    return res.json({
      message: "Only the Owner of the spot is authorized to edit.",
    });
  }

  // Update Spot
  await editSpot.update({
    address: address,
    city: city,
    state: state,
    country: country,
    lat: lat,
    lng: lng,
    name: name,
    description: description,
    price: price,
  });

  const updatedSpot = editSpot.toJSON();
  delete updatedSpot.User;

  return res.json(updatedSpot);
});

// Create a Spot - done!
router.post("/", requireAuth, validateSpotEdit, async (req, res) => {
  const {user} = req;
  const {address, city, state, country, lat, lng, name, description, price} =
    req.body;

  const newSpot = await Spot.create({
    ownerId: user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  return res.json(newSpot);
});

// Create and return a new image for a spot, specified by id
// router.post('/:spotId/images', requireAuth, async (req, res) => {

//     const{user} = req;

// })

// Delete a Spot - done!
router.delete("/:spotId", requireAuth, async (req, res) => {
  const deleteSpot = await Spot.findByPk(req.params.spotId, {
    include: [
      {
        model: User,
        attributes: ["id"],
      },
    ],
  });
  const {user} = req;

  // If Spot does NOT exist
  if (!deleteSpot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found.",
    });
  }

  // Only Owner can delete
  let spotObj = deleteSpot.toJSON();
  if (user.id !== spotObj.User.id) {
    res.status(401);
    return res.json({
      message: "Only the Owner of the spot is authorized to delete.",
    });
  }

  await deleteSpot.destroy();

  res.status(200);
  return res.json({
    message: "Successfully deleted",
  });
});

/* -- REVIEWS -- */

const validateReviews = [
  check("review")
    .exists({checkFalsy: true})
    .withMessage("Review text is required."),
  check("stars")
    .exists({checkFalsy: true})
    .isInt({min: 1})
    .isInt({max: 5})
    .withMessage("Stars must be an integer from 1 to 5."),
  handleValidationErrors,
];

// Get all Reviews by a Spot's id
router.get("/:spotId/reviews", async (req, res) => {
  const findSpot = await Spot.findByPk(req.params.spotId);

  // If Spot does not exist
  if (!findSpot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found.",
    });
  }

  const allReviews = await Review.findAll({
    where: {
      spotId: req.params.spotId,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  if (!allReviews.length) {
    return res.json({
      message: "There are no reviews for this spot.",
    });
  }

  return res.json(allReviews);
});

// Create a Review for a Spot based on Spot id
router.post("/:spotId/reviews", requireAuth, validateReviews, async (req, res) => {
  const findSpot = await Spot.findByPk(req.params.spotId);

  // If Spot does not exist
  if (!findSpot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found.",
    });
  }

  const {user} = req;
  const {review, stars} = req.body;

  const findExistReview = await Review.findOne({
    where: {
      userId: user.id,
      spotId: req.params.spotId,
    },
  });

  // If review exists for user
  if (findExistReview) {
    res.status(500);
    return res.json({
      message: "User already has a review for this spot",
    });
  }

  const newReview = await Review.create({
    spotId: req.params.spotId,
    userId: user.id,
    review,
    stars,
  });

  res.status(201);
  return res.json(newReview);
});



module.exports = router;
