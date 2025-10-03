'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transfer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transfer.belongsTo(models.User, { foreignKey: 'user_id' });
      Transfer.belongsTo(models.Envelope, { as: 'fromEnvelope', foreignKey: 'from_envelope_id' });
      Transfer.belongsTo(models.Envelope, { as: 'toEnvelope', foreignKey: 'to_envelope_id' });

    }
  }
  Transfer.init({
    user_id: DataTypes.INTEGER,
    from_envelope_id: DataTypes.INTEGER,
    to_envelope_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Transfer',
  });
  return Transfer;
};