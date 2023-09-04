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
    startDate: '2022-02-28',
    endDate: '2022-03-03'
  },
  {
    spotId: 2,
    userId: 2,
    startDate: '2022-03-11',
    endDate: '2022-03-15'
  },
  {
    spotId: 3,
    userId: 3,
    startDate: '2022-03-16',
    endDate: '2022-03-19'
  },
  {
    spotId: 4,
    userId: 1,
    startDate: '2022-03-20',
    endDate: '2022-03-22'
  },
  {
    spotId: 5,
    userId: 3,
    startDate: '2022-03-24',
    endDate: '2022-03-30'
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
