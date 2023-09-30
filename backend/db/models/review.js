'use strict';
const { Model  } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId'
      })
      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId'
      })
    }
  }
  Review.init({
    spotId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    review: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {

        len: [10, 500],

        thirtyMin(value) {

          if (value.length < 10) {
            throw new Error('Review must be 10 characters or more.')
          }
        }
      }
    },
    stars: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        isInt: true,
        min: 1,
        max: 5
      }
    },
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
