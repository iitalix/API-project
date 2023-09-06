// backend/routes/api/spot-images.js
const express = require("express");
const router = require("express").Router();

const {requireAuth} = require("../../utils/auth.js");
const {Spot, Review, ReviewImage, SpotImage, User} = require("../../db/models");

// Delete a Spot Image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const findImage = await SpotImage.findByPk(req.params.imageId, {
    include: [
      {
        model: Spot,
        attributes: ["ownerId"],
      },
    ],
  });
  const {user} = req;

  // If Spot Image does not exist
  if (!findImage) {
    res.status(404);
    return res.json({
      message: "Spot Image couldn't be found.",
    });
  }

  // Only Owner is authorized to edit
  let imageObj = findImage.toJSON();
  if (user.id !== imageObj.Spot.ownerId) {
    res.status(401);
    return res.json({
      message: "Only the Owner of the spot is authorized to delete.",
    });
  }

  await findImage.destroy();

  res.status(200);
  return res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
