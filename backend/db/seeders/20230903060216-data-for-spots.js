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
    address: "123 Bonafide St",
    city: "New York City",
    state: "NY",
    country: "USA",
    lat: 1.1,
    lng: 2.1,
    name: "The Palace",
    description: "You can't ask for more than this. Prime location with a wonderful view. Amenities include WiFi and all available streaming services, a videogame theater, dancefloor, and a personal driver to take you to where you wanna go.",
    price: 250,
  },
  {
    ownerId: 2,
    address: "456 Rainbow Rd",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    lat: 3.1,
    lng: 4.1,
    name: "Best Of The West",
    description: "Amenities include go-kart racing and free power-ups! Fully-stocked game room with every console and video game ever made as far back as the Intellivision. RTX 4090 Gaming PC, if that's your thing, too.",
    price: 250,
  },
  {
    ownerId: 3,
    address: "0716 Megabuilding H10",
    city: "Night City",
    state: "CA",
    country: "USA",
    lat: 5.1,
    lng: 6.1,
    name: "Rooms For Chooms",
    description: "Get away from the craziness and relax in this fully-furnished spot! Delamain is only a phonecall away to get you where you're going. Fast travelpoint locations right around the corner and Doc Rippers within a 5 minute walk! ",
    price: 250,
  },
  {
    ownerId: 1,
    address: "321 Downton Abbey",
    city: "Oxforshire",
    state: "Bampton",
    country: "England",
    lat: 7.1,
    lng: 8.1,
    name: "Future Castle Style Living",
    description: "Luxurious country castle with scenic views! You're gonna love the funny looking animals and the wonderful local accents! Swing by the pub for a stiff ale, if you fancy!",
    price: 250,
  },
  {
    ownerId: 2,
    address: "945 AI St",
    city: "Miami",
    state: "FL",
    country: "USA",
    lat: 9.1,
    lng: 10.1,
    name: "Crazy Place!",
    description: "Take a dip in the pool or relax in the sauna. An amazing spot with amenities too crazy to talk about here (call for details). This is a crazy place for a crazy city for only the craziest people!",
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
