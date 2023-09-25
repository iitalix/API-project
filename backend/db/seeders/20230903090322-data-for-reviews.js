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
    review: "Had a wonderful visit. This place exceeded all my expectations. The bed is very comfortable and the living space is incredibly huge. I highly recommend this place!",
    stars: 5
  },
  {
    spotId: 4,
    userId: 2,
    review: "Too expensive for what you actually get, so I docked it 1 star. Needs better price rate. Other than that, it's a beautiful place to stay at, and you won't be disappointed.",
    stars: 4
  },
  {
    spotId: 3,
    userId: 3,
    review: "Really enjoyed our stay. Wonderful hosts. Clean sheets. Definitely recommend. We really enjoyed the fireplace, and the location is very convenient to all the major shopping and dining!",
    stars: 4
  },
  {
    spotId: 2,
    userId: 1,
    review: "Very nice location. It feels like you're in a spaceship sometimes with all the curves and futuristic design. There's a game room in there somewhere. You'll have to spend time trying to find it, though!",
    stars: 5
  },
  {
    spotId: 1,
    userId: 3,
    review: "WOW! One of the best places we've stayed at in awhile. Worth every penny! If you're looking to throw a crazy party, your guests will definitely be impressed with this place. It's right around the corner from Kanye West, too.",
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
