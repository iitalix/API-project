'use strict';

const { User } = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([

      {
        email: 'demo@user.com',
        username: 'DemoUser',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'random1@user.com',
        username: 'RandomUser1',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        email: 'random2@user.com',
        username: 'RandomUser2',
        hashedPassword: bcrypt.hashSync('password2')
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['DemoUser', 'RandomUser1', 'RandomUser2'] }
    }, {});
  }
};
