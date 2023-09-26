'use strict';

const { User } = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
options.tableName = 'Users';

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([

      {
        email: 'demo@user.com',
        username: 'DemoUser',
        firstName: 'Demo',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'random1@user.com',
        username: 'RandomUser1',
        firstName: 'Joel',
        lastName: 'Miller',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        email: 'random2@user.com',
        username: 'RandomUser2',
        firstName: 'Nathan',
        lastName: 'Drake',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'random3@user.com',
        username: 'RandomUser3',
        firstName: 'Ellie',
        lastName: 'Williams',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'random4@user.com',
        username: 'RandomUser4',
        firstName: 'Elena',
        lastName: 'Fisher',
        hashedPassword: bcrypt.hashSync('password4')
      },

    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['DemoUser', 'RandomUser1', 'RandomUser2'] }
    }, {});
  }
};
