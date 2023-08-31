'use strict';
const { Model, Validator } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
      validate: {
        len: [4,30],

        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Username cannot be an email address.");
          }
        }
      }
    },
    email: {
      allowNull: false,
      unique: true,
      validate: {
        len: [3,256],
        isEmail: true
      },
      type: DataTypes.STRING,
    },
    hashedPassword: {
      allowNull: false,
      type: DataTypes.STRING.BINARY,
      validate: {
        len: [60,60]
      }
    },
  }, {
    sequelize,
    modelName: 'User',

    // add defaultScope
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
      }
    }
  });
  return User;
};
