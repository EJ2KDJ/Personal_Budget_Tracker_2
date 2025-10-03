'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Envelope extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Envelope.belongsTo(models.User, { foreignKey: 'user_id' });
      Envelope.belongsTo(models.Category, { foreignKey: 'category_id' });
      Envelope.hasMany(models.Transaction, { foreignKey: 'envelope_id' });
      Envelope.hasMany(models.Transfer, { foreignKey: 'from_envelope_id' });
      Envelope.hasMany(models.Transfer, { foreignKey: 'to_envelope_id' });
      Envelope.hasMany(models.RecurringTransaction, { foreignKey: 'envelope_id' });

    }
  }
  Envelope.init({
    user_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    budget: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Envelope',
  });
  return Envelope;
};