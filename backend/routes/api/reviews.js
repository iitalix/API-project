// backend/routes/api/review.js
const express = require("express");
const router = require("express").Router();

const {requireAuth} = require("../../utils/auth.js");
const {check} = require("express-validator");
const {handleValidationErrors} = require("../../utils/validation");
const {Spot, Review, ReviewImage, SpotImage, User} = require("../../db/models");

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

// Edit a Review
router.put("/:revewId", requireAuth, validateReviews, async (req, res) => {
  const findReview = await Review.findByPk(req.params.revewId, {
    include: [
      {
        model: User,
        attributes: ["id"],
      },
    ],
  });

  // If Review does not exist
  if (!findReview) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found.",
    });
  }

  const {user} = req;
  const {review, stars} = req.body;

  // Only Owner is authorized to edit
  let reviewObj = findReview.toJSON();
  if (user.id !== reviewObj.User.id) {
    res.status(401);
    return res.json({
      message: "Only the Owner of the spot is authorized to edit.",
    });
  }

  // Update Review
  await findReview.update({
    review: review,
    stars: stars,
  });

  const updatedReview = findReview.toJSON();
  delete updatedReview.User;

  return res.json(updatedReview);
});

module.exports = router;
