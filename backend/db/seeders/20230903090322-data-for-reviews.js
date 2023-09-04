'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'Reviews'

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
};

const { Review } = require('../models');

const validReviews = [
  {
    spotId: 5,
    userId: 2,
    review: "Had a wonderful visit, but could have been better tbh.",
    stars: 3
  },
  {
    spotId: 4,
    userId: 2,
    review: "Too expensive for what you actually get. Needs better price rate.",
    stars: 2
  },
  {
    spotId: 3,
    userId: 3,
    review: "Really enjoyed our stay. Wonderful hosts. Clean sheets. Definitely recommend.",
    stars: 4
  },
  {
    spotId: 2,
    userId: 1,
    review: "Pretty average, but you could do a lot worse. Very nice location.",
    stars: 3
  },
  {
    spotId: 1,
    userId: 3,
    review: "WOW! One of the best places we've stayed at in awhile. Worth every penny!",
    stars: 5
  }
];

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await Review.bulkCreate(validReviews, {
        validate: true,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    for (let reviewInfo of validReviews) {
      try {
        await Review.destroy({
          where: reviewInfo
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
};
