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
    spotId: 1,
    userId: 4,
    review: "Had a wonderful visit. This place exceeded all my expectations. The bed is very comfortable and the living space is incredibly huge. I highly recommend this place!",
    stars: 5
  },
  {
    spotId: 2,
    userId: 1,
    review: "Too expensive for what you actually get, so I docked it 1 star. Needs better price rate. Other than that, it's a beautiful place to stay at, and you won't be disappointed.",
    stars: 4
  },
  {
    spotId: 3,
    userId: 1,
    review: "Really enjoyed our stay. Wonderful hosts. Clean sheets. Definitely recommend. We really enjoyed the fireplace, and the location is very convenient to all the major shopping and dining!",
    stars: 4
  },
  {
    spotId: 4,
    userId: 5,
    review: "Very nice location. It feels like you're in a spaceship sometimes with all the curves and futuristic design. There's a game room in there somewhere. You'll have to spend time trying to find it, though!",
    stars: 5
  },
  {
    spotId: 5,
    userId: 1,
    review: "WOW! One of the best places we've stayed at in awhile. Worth every penny! If you're looking to throw a crazy party, your guests will definitely be impressed with this place. It's right around the corner from Kanye West, too.",
    stars: 5
  },
  {
    spotId: 1,
    userId: 2,
    review: "Great place to relax or party! We really enjoyed our stay here!",
    stars: 4
  },
  {
    spotId: 2,
    userId: 5,
    review: "Really loved the go-karting experience! There aren't many places like this one! If you're looking for someting different, this is it!",
    stars: 5
  },
  {
    spotId: 3,
    userId: 2,
    review: "Don't let the funny looking people roaming around fool you. This location is primo. Colorful sights and sounds everywhere. Driving distance to City Center and Pacifica make this a great location!",
    stars: 4
  },
  {
    spotId: 4,
    userId: 2,
    review: "Kinda feels like you're in a TV show, but still very cool. It rained a lot during our stay, which wasn't so bad as we got to enjoy a nice warm fireplace and the comforts of the home.",
    stars: 4
  },
  {
    spotId: 5,
    userId: 5,
    review: "Never seen a spot quite like this one! Totally unique, and the amenities are wonderful. After a night of partying, I slept like baby in the Cali King sized bed. You'll love it here!",
    stars: 5
  },
  {
    spotId: 1,
    userId: 3,
    review: "This place has it all...except for an automatic coffee maker. You'd think they'd have a Keurig or something. Who honestly wants to spend 10 minutes grinding beans then waiting for drip coffee? Great place, nonetheless!",
    stars: 4
  },
  {
    spotId: 2,
    userId: 3,
    review: "What an experience! Find the arcade room and stay in it. The complimentary snacks and drinks are an awesome amenity, especially for all-night gamers! If you're looking for a fun place to stay, you can't do much better than this.",
    stars: 4
  },
  {
    spotId: 3,
    userId: 4,
    review: "Interesting place. The Delamain service and Ripper Doc's cyberware availability are a nice touch. If you want to check out the local sites, there's a nearby food court and retail shopping downstairs. Don't venture too far without a smart pistol, tho!",
    stars: 4
  },
  {
    spotId: 4,
    userId: 3,
    review: "Can't really go wrong with this one. My only complaint is the weather here, but with a place like this--you really wanna stay inside, anyway.",
    stars: 4
  },
  {
    spotId: 5,
    userId: 3,
    review: "Spent most of my time in the pool and sauna. Lotsa nightlife happening in the area, so I was just here mostly to relax after a night of debauchery. Well worth it, tho!",
    stars: 4
  },
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
