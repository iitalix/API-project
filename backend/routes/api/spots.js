// backend/routes/api/spots
const express = require("express");
const router = require("express").Router();
const app = express();

const {requireAuth} = require("../../utils/auth.js");
const {check} = require("express-validator");
const {Op} = require("sequelize");
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
const validateQueryEdit = [
  check("minLat")
    .optional({value: "undefined"})
    .exists({checkFalsy: true})
    .isFloat({min: -90, max: 90})
    .withMessage("Latitude is not valid."),
  check("maxLat")
    .optional({value: "undefined"})
    .exists({checkFalsy: true})
    .isFloat({min: -90, max: 90})
    .withMessage("Latitude is not valid."),
  check("minlng")
    .optional({value: "undefined"})
    .exists({checkFalsy: true})
    .isFloat({min: -180, max: 180})
    .withMessage("Longitude is not valid."),
  check("maxlng")
    .optional({value: "undefined"})
    .exists({checkFalsy: true})
    .isFloat({min: -180, max: 180})
    .withMessage("Longitude is not valid."),
  check("minPrice")
    .optional({value: "undefined"})
    .exists({checkFalsy: true})
    .isFloat({min: 0})
    .withMessage(
      "Minimum price must be a decimal, and greater than or equal to 0."
    ),
  check("maxPrice")
    .optional({value: "undefined"})
    .exists({checkFalsy: true})
    .isFloat({min: 0})
    .withMessage(
      "Maximum price must be a decimal, and greater than or equal to 0."
    ),
  handleValidationErrors,
];

const validateSpotEdit = [
  check("address")
    .optional({value: "undefined"})
    .exists({checkFalsy: true})
    .withMessage("Street address is required."),
  check("city")
    .optional({value: "undefined"})
    .exists({checkFalsy: true})
    .withMessage("City is required."),
  check("state")
    .optional({value: "undefined"})
    .exists({checkFalsy: true})
    .withMessage("State is required."),
  check("country")
    .optional({value: "undefined"})
    .exists({checkFalsy: true})
    .withMessage("Country is required."),
  check("lat")
    .optional({value: "undefined"})
    .exists({checkFalsy: true})
    .isDecimal({force_decimal: true})
    .withMessage("Latitude is not valid."),
  check("lng")
    .optional({value: "undefined"})
    .exists({checkFalsy: true})
    .isDecimal({force_decimal: true})
    .withMessage("Longitude is not valid."),
  check("name")
    .optional({value: "undefined"})
    .exists({checkFalsy: true})
    .isLength({max: 49})
    .withMessage("Name is required."),
  check("description")
    .optional({value: "undefined"})
    .exists({checkFalsy: true})
    .isLength({min: 30})
    .withMessage("Description needs a minimum of 30 characters."),
  check("price")
    .optional({value: "undefined"})
    .exists({checkFalsy: true})
    .withMessage("Price per day is required.")
    .isDecimal({force_decimal: true})
    .withMessage("Price must be a decimal."),

  handleValidationErrors,
];

// GET all Spots
router.get("/", validateQueryEdit, async (req, res) => {
  let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} =
    req.query;

  page = parseInt(page);
  size = parseInt(size);

  if (Number.isNaN(page) || page < 0) page = 1;
  if (Number.isNaN(size) || size < 0) size = 20;

  let pagination = {
    limit: size,
    offset: size * (page - 1),
  };

  // Search Queries
  const where = {};

  // Latitude
  if (minLat && !maxLat) where.lat = {[Op.gte]: minLat};
  if (maxLat && !minLat) where.lat = {[Op.lte]: maxLat};
  if (minLat && maxLat)
    where.lat = {[Op.and]: [{[Op.gte]: minLat}, {[Op.lte]: maxLat}]};

  // Longitude
  if (minLng && !maxLng) where.lng = {[Op.gte]: minLng};
  if (maxLng && !minLng) where.lng = {[Op.lte]: maxLng};
  if (minLng && maxLng)
    where.lng = {[Op.and]: [{[Op.gte]: minLng}, {[Op.lte]: maxLng}]};

  // Price
  if (minPrice && !maxPrice) where.price = {[Op.gte]: minPrice};
  if (maxPrice && !minPrice) where.price = {[Op.lte]: maxPrice};
  if (minPrice && maxPrice)
    where.price = {[Op.and]: [{[Op.gte]: minPrice}, {[Op.lte]: maxPrice}]};

  const allSpots = await Spot.findAll({
    where,
    include: [
      {
        model: Review,
      },
      {
        model: SpotImage,
      },
    ],
    ...pagination,
  });

  // Add Rating and Preview Image
  let spotsList = [];
  allSpots.forEach((spot) => {
    spotsList.push(spot.toJSON());
  });

  spotsList.forEach((spot) => {

    let count = 0;
    spot.Reviews.forEach((review) => {
      count += review.stars;
    });

    spot.avgRating = (count / spot.Reviews.length).toFixed(1);

    if (!spot.SpotImages.length) {
      spot.previewImage = "There is no preview image for this spot.";
    }

    spot.SpotImages.forEach((image) => {
      if (image.preview === true) {
        spot.previewImage = image.url;
      }
    });

    delete spot.Reviews;
    delete spot.SpotImages;
  });

  if (!spotsList.length) {
    return res.json({
      message:
        "This page is empty. Please refine your query by adding missing filters, adjusting your query parameters, limiting the size of your page results, or choosing a previous page.",
    });
  }

  return res.json({
    Spots: spotsList,
    page: Number(page),
    size: parseInt(size),
  });
});

// Get all Spots of Current User
router.get("/current", requireAuth, async (req, res) => {
  const {user} = req;
  const allSpotsUser = await Spot.findAll({
    where: {
      ownerId: user.id,
    },
    include: [
      {
        model: SpotImage,
        attributes: ["url", "preview"],
      },
      {
        model: Review,
        attributes: ["stars"],
      },
    ],
  });

  let allSpotsUserObj = [];
  allSpotsUser.forEach((spot) => {
    allSpotsUserObj.push(spot.toJSON());
  });

  allSpotsUserObj.forEach((spot) => {
    spot.SpotImages.forEach((image) => {
      if (image.preview === true) {
        spot.previewImage = image.url;
      }
    });

    if (!spot.SpotImages.length) {
      spot.previewImage = "There is no preview image for this spot.";
    }

    spot.SpotImages.forEach((image) => {
      if (image.preview === true) {
        spot.previewImage = image.url;
      }
    });


    let count = 0;
    spot.Reviews.forEach((review) => {
      count += review.stars;
    });

    spot.avgRating = (count / spot.Reviews.length).toFixed(1)

    delete spot.Reviews;
    delete spot.SpotImages;
  });

  if (!allSpotsUserObj.length) {
    return res.json({
      message: "You currently have no spots setup.",
    });
  }

  return res.json({Spots: allSpotsUserObj});
});

// GET details for a Spot from an id
router.get("/:spotId(\\d+)", async (req, res) => {
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

  let count = 0;
  findSpot.Reviews.forEach((review) => {
    count += review.stars;
  });

  let avgRating = (count / numReviews).toFixed(1);

  delete findSpot.Reviews;

  return res.json({
    ...findSpot,
    avgRating,
    numReviews,
  });
});

// Add an image to a Spot based on Spot's id
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
    preview: preview,
  });

  return res.json(newImage);
});

// Edit a Spot
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

// Create a Spot
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

// Delete a Spot
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
    order: [["createdAt", "DESC"]]
  });

  if (!allReviews.length) {
    return res.json({
      message: "There are no reviews for this spot.",
    });
  }


  const allReviewsArr = [];
  allReviews.forEach((review) => {

    allReviewsArr.push(review.toJSON());
  })

  allReviewsArr.forEach((review) => {

    const badcreateDate = new Date(review.createdAt);
    const createDate = badcreateDate.toDateString();

    const badupdateDate = new Date(review.updatedAt);
    const updateDate = badupdateDate.toDateString();

    review.createdAt = createDate;
    review.updatedAt = updateDate;
  })

   return res.json({Reviews: allReviewsArr})
});

// Create a Review for a Spot based on Spot id
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

  if (!bookingsArr.length) {
    return res.json({
      message: "Be the first to book this spot!",
    });
  }

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
router.post("/:spotId/bookings", requireAuth, async (req, res, next) => {
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
  if (user.id === spotObj.User.id) {
    res.status(401);
    return res.json({
      message: "Cannot create a booking on a spot that you own.",
    });
  }

  // Get bookings by Spot id
  const spotBookings = await Booking.findAll({
    where: {
      spotId: req.params.spotId,
    },
    include: [
      {
        model: Spot,
      },
    ],
  });

  let spotBookingsArr = [];
  spotBookings.forEach((booking) => {
    spotBookingsArr.push(booking.toJSON());
  });

  /* -- Booking Conflict Handler */

  // StartDate Conversion
  const newStartDate = new Date(startDate);
  const requestedStart = newStartDate.getTime();

  // EndDate Conversion
  const newEndDate = new Date(endDate);
  const requestedEnd = newEndDate.getTime();

  // Pre-Existing Booking Conflicts
  for (let booking of spotBookingsArr) {
    // Existing Start Date
    const bookingStartDate = new Date(booking.startDate);
    const reservedStartDate = bookingStartDate.getTime();

    // Existing End Date
    const bookingEndDate = new Date(booking.endDate);
    const reservedEndDate = bookingEndDate.getTime();

    if (
      (requestedStart >= reservedStartDate &&
        requestedStart < reservedEndDate) ||
      (requestedEnd > reservedStartDate && requestedEnd <= reservedEndDate) ||
      (reservedStartDate >= requestedStart && reservedEndDate <= requestedEnd)
    ) {
      res.status(403);
      return res.json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    }
  }

  // Create booking
  const newBooking = await Booking.create({
    spotId: req.params.spotId,
    userId: user.id,
    startDate: startDate,
    endDate: endDate,
  });

  return res.json(newBooking);
});

module.exports = router;
