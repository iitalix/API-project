// backend/routes/api/bookings
const express = require("express");
const router = require("express").Router();

const {requireAuth} = require("../../utils/auth.js");
const {Booking, Review, Spot, User} = require("../../db/models");

/* -- BOOKINGS -- */

// Get all Current User's Bookings
router.get("/current", requireAuth, async (req, res) => {
  const {user} = req;
  const userBookings = await Booking.findAll({
    where: {
      userId: user.id,
    },
    include: [
      {
        model: Spot,
        attributes: {
            exclude: ['description', 'createdAt', 'updatedAt']
        }
      },
    ],
  });

  return res.json({Bookings: userBookings});
});

module.exports = router;
