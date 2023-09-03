'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'ReviewImages'

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
};

const { ReviewImage } = require('../models');

const validReviewImages = [
  {
    reviewId: 1,
    url: "https://i.pinimg.com/originals/d1/b1/d5/d1b1d513c78fb6a5d04df0c1a01315f8.jpg"
  },
  {
    reviewId: 3,
    url: "https://archello.s3.eu-central-1.amazonaws.com/images/2022/09/30/manna-interior-modern-classic-house-design-private-houses-archello.1664525674.874.jpg"
  },
  {
    reviewId: 2,
    url: "https://i.pinimg.com/736x/78/09/17/780917036923138d080077382262a019--interiordesign-decoration.jpg"
  },
  {
    reviewId: 5,
    url: "https://luxurylifestyleawards.com/wp-content/uploads/2021/07/03-18.jpg"
  },
  {
    reviewId: 4,
    url: "https://www.decoraid.com/wp-content/uploads/2021/04/Modern-Country-scaled.jpeg"
  },
]

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await ReviewImage.bulkCreate(validReviewImages, {
        validate: true,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    for (let reviewImage of validReviewImages) {
      try {
        await ReviewImage.destroy({
          where: reviewImage
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
};
