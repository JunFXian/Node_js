'use strict';
module.exports = (sequelize, DataTypes) => {
  var Ingredient = sequelize.define('Ingredient', {
    quantity: DataTypes.FLOAT,
    measure: DataTypes.STRING,
    ingredient: DataTypes.STRING
  });

  Ingredient.associate = function(models) {
    // associations can be defined here
    // Using additional options like CASCADE etc for demonstration
    // Can also simply do Task.belongsTo(models.User);
    Ingredient.belongsTo(models.Recipe, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Ingredient;
};