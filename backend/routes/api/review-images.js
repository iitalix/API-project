// backend/routes/api/review-images.js
const express = require("express");
const router = require("express").Router();

const {requireAuth} = require("../../utils/auth.js");
const {Spot, Review, ReviewImage, SpotImage, User} = require("../../db/models");

// Delete a Review Image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const findImage = await ReviewImage.findByPk(req.params.imageId, {
    include: [
      {
        model: Review,
        attributes: ["userId"],
      },
    ],
  });

  const {user} = req;

  // If Spot Image does not exist
  if (!findImage) {
    res.status(404);
    return res.json({
      message: "Review Image couldn't be found.",
    });
  }

  // Only Owner is authorized to edit
  let imageObj = findImage.toJSON();
  if (user.id !== imageObj.Review.userId) {
    res.status(401);
    return res.json({
      message: "Only the Owner of the review is authorized to delete.",
    });
  }

  await findImage.destroy();

  res.status(200);
  return res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
