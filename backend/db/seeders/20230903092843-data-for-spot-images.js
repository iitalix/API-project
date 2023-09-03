'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'SpotImages'

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
};

const { SpotImage } = require('../models');

const validSpotImages = [
  {
    spotId: 5,
    url: "https://i.pinimg.com/originals/d1/b1/d5/d1b1d513c78fb6a5d04df0c1a01315f8.jpg",
    preview: true
  },
  {
    spotId: 1,
    url: "https://luxurylifestyleawards.com/wp-content/uploads/2021/07/03-18.jpg",
    preview: true
  },
  {
    spotId: 4,
    url: "https://i.pinimg.com/736x/78/09/17/780917036923138d080077382262a019--interiordesign-decoration.jpg",
    preview: true
  },
  {
    spotId: 2,
    url: "https://www.decoraid.com/wp-content/uploads/2021/04/Modern-Country-scaled.jpeg",
    preview: true
  },
  {
    spotId: 3,
    url: "https://archello.s3.eu-central-1.amazonaws.com/images/2022/09/30/manna-interior-modern-classic-house-design-private-houses-archello.1664525674.874.jpg",
    preview: true
  }
];

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await SpotImage.bulkCreate(validSpotImages, {
        validate: true,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    for (let spotImage of validSpotImages) {
      try {
        await SpotImage.destroy({
          where: spotImage
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
};
