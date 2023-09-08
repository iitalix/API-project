// backend/routes/api/bookings
const express = require("express");
const router = require("express").Router();

const {requireAuth} = require("../../utils/auth.js");
const {Booking, Review, Spot, SpotImage, User} = require("../../db/models");

/* -- BOOKINGS -- */

// Get all Current User's Bookings - done!
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
          exclude: ["description", "createdAt", "updatedAt"],
        },
        include: [
          {
            model: SpotImage,
            attributes: ["url", "preview"],
          },
        ],
      },
    ],
  });

  let userBookingsArr = [];
  userBookings.forEach((booking) => {
    userBookingsArr.push(booking.toJSON());
  });

  userBookingsArr.forEach((booking) => {
    booking.Spot.SpotImages.forEach((image) => {
      if (image.preview) booking.Spot.previewImage = image.url;
      else booking.Spot.previewImage = "There are no images for this spot.";
    });

    if (!booking.Spot.SpotImages.length) {
      booking.Spot.previewImage = "There are no images for this spot.";
    }

    delete booking.Spot.SpotImages;
  });

  if (!userBookingsArr.length) {
    return res.json({
      message: "You have no currently scheduled bookings."
    })
  }

  return res.json({Bookings: userBookingsArr});
});

// Edit a Booking
router.put("/:bookingId", requireAuth, async (req, res) => {
  const findBooking = await Booking.findByPk(req.params.bookingId);
  const {startDate, endDate} = req.body;

  // If Booking does not exist
  if (!findBooking) {
    res.status(404);
    res.json({
      message: "Booking couldn't be found.",
    });
  }

  let editBookingObj = findBooking.toJSON();

  // Only the Owner of the booking can edit
  if (req.user.id !== editBookingObj.userId) {
    res.status(400);
    res.json({
      message: "Bookings can only be edited by their Owner.",
    });
  }

  // StartDate Conversion
  const newStartDate = new Date(startDate);
  const requestedStart = newStartDate.getTime();

  // EndDate Conversion
  const newEndDate = new Date(endDate);
  const requestedEnd = newEndDate.getTime();

  // EndDate After StartDate Conflict
  if (requestedEnd < requestedStart) {
    res.status(400);
    res.json({
      message: "Bad Request", // (or "Validation error" if generated by Sequelize),
      errors: {
        endDate: "endDate cannot come before startDate",
      },
    });
  }

  // EndDate Exceeded Edit Limit
  if (requestedStart > editBookingObj.endDate) {
    res.status(403);
    res.json({
      message: "Past bookings can't be modified.",
    });
  }

  // Get bookings by Spot id
  const spotBookings = await Booking.findAll({
    where: {
      spotId: findBooking.spotId,
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

  // Pre-Existing Booking Conflicts
  for (let booking of spotBookingsArr) {
    // Existing Start Date
    const bookingStartDate = new Date(booking.startDate);
    const reservedStartDate = bookingStartDate.getTime();

    // Existing End Date
    const bookingEndDate = new Date(booking.endDate);
    const reservedEndDate = bookingEndDate.getTime();

    console.log("BOOKING USER ID:", booking.userId);
    console.log("REQ USER ID", req.user.id);

    // if the requested start is greater or equal to reserved start,
    // and reqested end is greater than or equal to reserved end
    if (
      (requestedStart >= reservedStartDate &&
        requestedStart < reservedEndDate &&
        booking.userId !== req.user.id) ||
      (requestedEnd > reservedStartDate &&
        requestedEnd <= reservedEndDate &&
        booking.userId !== req.user.id) ||
      (reservedStartDate >= requestedStart &&
        reservedEndDate <= requestedEnd &&
        booking.userId !== req.user.id)
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

  await findBooking.update({
    startDate: startDate,
    endDate: endDate,
  });

  return res.json(findBooking);
});

// Delete Booking
router.delete("/:bookingId", requireAuth, async (req, res) => {
  const findBooking = await Booking.findByPk(req.params.bookingId, {
    include: [
      {
        model: Spot,
        attributes: ["ownerId"],
      },
    ],
  });

  // If Booking does not exist
  if (!findBooking) {
    res.status(404);
    return res.json({
      message: "Booking couldn't be found.",
    });
  }

  // Must be Owner of Spot/Booking
  let deleteBooking = findBooking.toJSON();
  if (
    (req.user.id !== deleteBooking.userId) &&
    (req.user.id !== deleteBooking.Spot.ownerId)
  ) {

    res.status(401);
    return res.json({
      message: "Only the Owner of the spot/booking can delete a booking.",
    });
  };

  // Booking has been started
  if (deleteBooking.updatedAt > deleteBooking.startDate) {

    res.status(403);
    res.json({
      message: "Bookings that have been started can't be deleted"
    })
  };

  // Delete the booking
  await findBooking.destroy();

  res.status(200);
  return res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
