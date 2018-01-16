'use strict';
module.exports = (sequelize, DataTypes) => {
  var Step = sequelize.define('Step', {
    stepId: DataTypes.INTEGER,
    shortDescription: DataTypes.STRING,
    description: DataTypes.TEXT,
    videoURL: DataTypes.STRING,
    thumbnailURL: DataTypes.STRING
  });
    
  Step.associate = function(models) {
    // associations can be defined here
    Step.belongsTo(models.Recipe, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'recipeId',
        allowNull: false
      }
    });
  };

  return Step;
};