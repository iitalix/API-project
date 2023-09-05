'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'Bookings'

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const { Booking } = require('../models');

const validBookings = [

  {
    spotId: 1,
    userId: 1,
    startDate: '2023-12-28',
    endDate: '2023-11-04'
  },
  {
    spotId: 2,
    userId: 2,
    startDate: '2023-11-11',
    endDate: '2023-11-15'
  },
  {
    spotId: 3,
    userId: 3,
    startDate: '2023-11-16',
    endDate: '2023-11-19'
  },
  {
    spotId: 4,
    userId: 1,
    startDate: '2023-11-20',
    endDate: '2023-11-22'
  },
  {
    spotId: 5,
    userId: 3,
    startDate: '2023-11-24',
    endDate: '2023-11-30'
  },
]

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await Booking.bulkCreate(validBookings, {
        validate: true,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    for (let bookingInfo of validBookings) {
      try {
        await Booking.destroy({
          where: bookingInfo
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
};
