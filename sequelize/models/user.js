'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Category, { foreignKey: 'user_id' });
      User.hasMany(models.Envelope, { foreignKey: 'user_id' });
      User.hasMany(models.Transaction, { foreignKey: 'user_id' });
      User.hasMany(models.Transfer, { foreignKey: 'user_id' });
      User.hasMany(models.RecurringTransaction, { foreignKey: 'user_id' });

    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};