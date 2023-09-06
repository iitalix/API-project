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
router.put("/:reviewId", requireAuth, validateReviews, async (req, res) => {
  const findReview = await Review.findByPk(req.params.reviewId, {
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
      message: "Only the author of the review is authorized to edit.",
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

// Add an image to a Review based on Review's Id
router.post("/:reviewId/images", requireAuth, async (req, res) => {
  const findReview = await Review.findByPk(req.params.reviewId, {
    include: [
      {
        model: User,
        attributes: ["id"],
      },
    ],
  });

  const {user} = req;
  const {url} = req.body;

  // If Review does not exist
  if (!findReview) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found.",
    });
  }

  // Only Owner is authorized to add images
  let reviewObj = findReview.toJSON();
  if (user.id !== reviewObj.User.id) {
    res.status(401);
    return res.json({
      message: "Only the author of the review is authorized to add images.",
    });
  }

  // Only 10 images allowed per resource
  const getAllImages = await ReviewImage.findAll({
    where: {
      reviewId: req.params.reviewId,
    },
  });

  let allImagesArr = [];
  getAllImages.forEach(image => {

    allImagesArr.push(image)
  })

  if (allImagesArr.length >= 10) {
    res.status(403);
    return res.json({
      message: "Maximum number of images for this resource was reached",
    });
  }

  // Create Review Image
  const newImage = await ReviewImage.create({
    reviewId: reviewObj.id,
    url: url,
  });

  const newImageObj = newImage.toJSON();

  delete newImageObj.updatedAt;
  delete newImageObj.createdAt;

  return res.json(newImageObj);
});

// Delete a Review
router.delete("/:reviewId", requireAuth, async (req, res) => {
  const deleteReview = await Review.findByPk(req.params.reviewId, {
    include: [
      {
        model: User,
        attributes: ["id"],
      },
    ],
  });

  const {user} = req;

  // If Review does not exist
  if (!deleteReview) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found.",
    });
  }


  // Only Owner is authorized to edit
  let deleteRevObj = deleteReview.toJSON();
  if (user.id !== deleteRevObj.User.id) {
    res.status(401);
    return res.json({
      message: "Only the Owner of this review can delete it.",
    });
  }

  // Delete Review
  await deleteReview.destroy();

  res.status(200);
  return res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
