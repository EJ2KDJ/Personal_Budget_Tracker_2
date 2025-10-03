'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, { foreignKey: 'user_id' });
      Transaction.belongsTo(models.Envelope, { foreignKey: 'envelope_id' });

    }
  }
  Transaction.init({
    user_id: DataTypes.INTEGER,
    envelope_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    type: DataTypes.STRING,
    description: DataTypes.TEXT,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};