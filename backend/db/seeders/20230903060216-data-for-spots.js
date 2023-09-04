'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'Spots'

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
};

const { Spot } = require('../models');

const validSpots = [
  {
    ownerId: 1,
    address: "123 Sesame St",
    city: "Wichita",
    state: "KS",
    country: "USA",
    lat: 1,
    lng: 2,
    name: "Very cool place",
    description: "Home to Oscar the Grouch, Big Bird, Elmo, Ernie & Bert, Cookie Monster and many more!",
    price: 250,
  },
  {
    ownerId: 2,
    address: "456 Rainbow Rd",
    city: "Mushroom Kingdom",
    state: "CA",
    country: "USA",
    lat: 3,
    lng: 4,
    name: "Colorful Rental!",
    description: "Amenities include go-kart racing and free power-ups!",
    price: 250,
  },
  {
    ownerId: 3,
    address: "789 Elm St",
    city: "Hollywood",
    state: "CA",
    country: "USA",
    lat: 5,
    lng: 6,
    name: "Nightmare Fantasy!",
    description: "The vacation rental of your dreams!",
    price: 250,
  },
  {
    ownerId: 1,
    address: "321 Downton Abbey",
    city: "Oxforshire",
    state: "Bampton",
    country: "England",
    lat: 7,
    lng: 8,
    name: "Castle Style Living",
    description: "Luxurious country castle with scenic views!",
    price: 250,
  },
  {
    ownerId: 2,
    address: "21 Jump St",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    lat: 9,
    lng: 10,
    name: "Popular place!",
    description: "Kinda feels like a TV series!",
    price: 250,
  }
];


module.exports = {

    async up (queryInterface, Sequelize) {
      try {
        await Spot.bulkCreate(validSpots, {
          validate: true,
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    async down (queryInterface, Sequelize) {
      for (let spotInfo of validSpots) {
        try {
          await Spot.destroy({
            where: spotInfo
          });
        } catch (err) {
          console.log(err);
          throw err;
        }
      }
    },
};
