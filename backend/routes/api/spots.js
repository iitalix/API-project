// backend/routes/api/spots
const express = require("express");
const router = require("express").Router();

const {requireAuth} = require("../../utils/auth.js");
const {check} = require("express-validator");
const {handleValidationErrors} = require("../../utils/validation");
const {Spot, Review, SpotImage, User} = require("../../db/models");

// GET all Spots
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

// GET details for a Spot from an id
router.get("/:spotId", async (req, res) => {
  let findSpot = await Spot.findByPk(req.params.spotId, {
    include: [
      {
        model: Review,
      },
      {
        model: SpotImage,
        attributes: ['id', 'url', 'preview']
      },
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
    ],
  });

  if (!findSpot) {

    res.status(404);
    return res.json({

        message: "Spot does not exist."
    })
  }

  findSpot = findSpot.toJSON();

  let numReviews = findSpot.Reviews.length;
  let avgRating;
  findSpot.Reviews.forEach(review => {

    avgRating = review.stars;
  })

  delete findSpot.Reviews;

  return res.json({
    ...findSpot,
    avgRating,
    numReviews,
  });
});

// GET all spots from Current User
// router.get('/current', requireAuth, async (req, res) => {

//     const userSpots = await Spot.findAll({

//         where
//     })
// })

// Create a Spot
router.post('/', requireAuth, async (req, res) => {
    const {address, city, state, country, lat, lng, name, description, price} = req.body;

    const newSpot = await Spot.create({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });

    return res.json(newSpot);
});

module.exports = router;
