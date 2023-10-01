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
    spotId: 1,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155703414936842311/seedpic-5.png",
    preview: true
  },
  {
    spotId: 1,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155703414571933736/seedpic-4.png",
    preview: false
  },
  {
    spotId: 1,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155703414244769812/seedpic-3.png",
    preview: false
  },
  {
    spotId: 1,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155703413837934592/seedpic-2.png",
    preview: false
  },
  {
    spotId: 1,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155703413238145034/seedpic-1.png",
    preview: false
  },
  {
    spotId: 2,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155705607094009916/seedpic-6.png",
    preview: true
  },
  {
    spotId: 2,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155705607429574766/seedpic-7.png",
    preview: false
  },
  {
    spotId: 2,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155705607756718130/seedpic-8.png",
    preview: false
  },
  {
    spotId: 2,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155705608067108924/seedpic-9.png",
    preview: false
  },
  {
    spotId: 2,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155705608444584016/seedpic-10.png",
    preview: false
  },
  {
    spotId: 3,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155705994068906014/seedpic-14.png",
    preview: true
  },
  {
    spotId: 3,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155705993771102208/seedpic-13.png",
    preview: false
  },
  {
    spotId: 3,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155705993477509140/seedpic-12.png",
    preview: false
  },
  {
    spotId: 3,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155705993141956638/seedpic-11.png",
    preview: false
  },
  {
    spotId: 3,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155705992458272828/seedpic-15.png",
    preview: false
  },
  {
    spotId: 4,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155706219890216980/seedpic-20.png",
    preview: true
  },
  {
    spotId: 4,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155706219521114235/seedpic-19.png",
    preview: false
  },
  {
    spotId: 4,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155706219089104956/seedpic-18.png",
    preview: false
  },
  {
    spotId: 4,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155706218694836335/seedpic-17.png",
    preview: false
  },
  {
    spotId: 4,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155706218359300166/seedpic-16.png",
    preview: false
  },
  {
    spotId: 5,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155706428502315028/seedpic-21.png",
    preview: true
  },
  {
    spotId: 5,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155706428909174814/seedpic-22.png",
    preview: false
  },
  {
    spotId: 5,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155706429903212574/seedpic-25.png",
    preview: false
  },
  {
    spotId: 5,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155706429320200252/seedpic-23.png",
    preview: false
  },
  {
    spotId: 5,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1155706429605429410/seedpic-24.png",
    preview: false
  },
  {
    spotId: 6,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1156104277526315068/seedpic-26.png",
    preview: true
  },
  {
    spotId: 6,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1156104277769601115/seedpic-27.png",
    preview: false
  },
  {
    spotId: 6,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1156104278021263441/seedpic-28.png",
    preview: false
  },
  {
    spotId: 6,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1156104278738468864/seedpic-29.png",
    preview: false
  },
  {
    spotId: 6,
    url: "https://cdn.discordapp.com/attachments/1155249585913090118/1156104279078223912/seedpic-30.png",
    preview: false
  },
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
