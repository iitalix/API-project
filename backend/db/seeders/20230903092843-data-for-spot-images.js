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
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155258347919003699/seedpic-1.png",
    preview: true
  },
  {
    spotId: 1,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155258348460048444/seedpic-2.png",
    preview: true
  },
  {
    spotId: 4,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155258348858523698/seedpic-3.png",
    preview: true
  },
  {
    spotId: 2,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155258349282152458/seedpic-4.png",
    preview: true
  },
  {
    spotId: 3,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155258349684801566/seedpic-5.png",
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
