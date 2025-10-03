'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RecurringTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RecurringTransaction.belongsTo(models.User, { foreignKey: 'user_id' });
      RecurringTransaction.belongsTo(models.Envelope, { foreignKey: 'envelope_id' });


    }
  }
  RecurringTransaction.init({
    user_id: DataTypes.INTEGER,
    envelope_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    type: DataTypes.STRING,
    description: DataTypes.TEXT,
    frequency: DataTypes.STRING,
    next_occurrence: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'RecurringTransaction',
  });
  return RecurringTransaction;
};