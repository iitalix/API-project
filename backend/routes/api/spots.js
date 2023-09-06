// backend/routes/api/spots
const express = require("express");
const router = require("express").Router();

const {requireAuth} = require("../../utils/auth.js");

const {check} = require("express-validator");
const {handleValidationErrors} = require("../../utils/validation");
const {
  Booking,
  Review,
  ReviewImage,
  Spot,
  SpotImage,
  User,
} = require("../../db/models");


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

  // Add Rating and Preview Image
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

  return res.json({Spots: spotsList});
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

// !! GET ALL SPOTS FROM CURRENT USER - INCOMPLETE!!
// Validation error: "current" is not a valid integer
router.get('/current', requireAuth, async (req, res) => {

  const {user} = req;
  const allSpotsUser = await Spot.findAll({

    where: {
      ownerId: user.id
    }
  })

  return res.json(allSpotsUser)
})

// Add an image to a Spot based on Spot's id - DONE!
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const findSpot = await Spot.findByPk(req.params.spotId);
  const {user} = req;
  const {url, preview} = req.body;

  // If Spot does not exist
  if (!findSpot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found.",
    });
  }

  // Only Owner is authorized to add image
  let spotObj = findSpot.toJSON();
  console.log(spotObj)
  if (user.id !== spotObj.ownerId) {
    res.status(401);
    return res.json({
      message: "Only the Owner of the spot is authorized to edit.",
    });
  }

  // Add image to Spot
  const newImage = await SpotImage.create({

    spotId: spotObj.id,
    url: url,
    preview: preview
  })

  return res.json(newImage);
});

// Edit a Spot - done, with questions:
// How precise is error-checking supposed to be?
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

// Get all Reviews by a Spot's id - done!
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

  return res.json({Reviews: allReviews});
});

// Create a Review for a Spot based on Spot id - done!
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReviews,
  async (req, res) => {
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

    // Cannot post a review if user already has existing review
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
  }
);

/* -- BOOKINGS -- */

// Get all Bookings for a Spot based on the Spot's id
// Authenticated user (XSRF-TOKEN) not working

router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const findSpot = await Spot.findByPk(req.params.spotId);
  const {user} = req;

  // If Spot does not exist
  if (!findSpot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found.",
    });
  }

  // Get bookings by Spot id
  const spotBookings = await Booking.findAll({
    where: {
      spotId: req.params.spotId,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
      },
    ],
  });

  let bookingsArr = [];
  spotBookings.forEach((booking) => {
    bookingsArr.push(booking.toJSON());
  });

  bookingsArr.forEach((booking) => {
    if (user.id === booking.Spot.ownerId) {
      delete booking.Spot;
    } else {
      delete booking.id;
      delete booking.userId;
      delete booking.createdAt;
      delete booking.updatedAt;
      delete booking.User;
      delete booking.Spot;
    }
  });

  return res.json({Bookings: bookingsArr});
});

// Create a Booking from a Spot's id
router.post("/:spotId/bookings", requireAuth, async (req, res) => {
  const findSpot = await Spot.findByPk(req.params.spotId, {
    include: [
      {
        model: Booking,
        attributes: ["startDate", "endDate"],
      },
      {
        model: User,
        attributes: ["id"],
      },
    ],
  });

  const {user} = req;
  const {startDate, endDate} = req.body;

  // If Spot does not exist
  if (!findSpot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found.",
    });
  }

  // Only non-Owner can create booking
  let spotObj = findSpot.toJSON();
  console.log(spotObj);
  if (user.id === spotObj.User.id) {
    res.status(401);
    return res.json({
      message: "Cannot create a booking on a spot that you own.",
    });
  }

  // Create booking
  const newBooking = await Booking.create({
    spotId: req.params.spotId,
    userId: user.id,
    startDate: startDate,
    endDate: endDate,
  });

  // If booking already exists for specified dates, respond with 403 error
  // -- in progress --

  return res.json(newBooking);
});

module.exports = router;
