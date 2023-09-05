'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId'
      })
      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId'
      })
      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId'
      })
      Spot.hasMany(models.Review, {
        foreignKey: 'spotId'
      })
    }
  }
  Spot.init({
    ownerId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      }
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      }
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      }
    },
    country: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      }
    },
    lat: {
      allowNull: false,
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: true,
        isNumeric: true
      }
    },
    lng: {
      allowNull: false,
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: true,
        isNumeric: true
      }
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    price: {
      allowNull: false,
      type: DataTypes.DECIMAL,
      validate: {
        notEmpty: true,
        isDecimal: true
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
