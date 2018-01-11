'use strict';
module.exports = (sequelize, DataTypes) => {
  var Recipe = sequelize.define('Recipe', {
    name: DataTypes.STRING,
    servings: DataTypes.INTEGER,
    image: DataTypes.STRING
  });

  Recipe.associate = function(models) {
    // associations can be defined here
    Recipe.hasMany(models.Ingredient);
    Recipe.hasMany(models.Step);
  };
          
  return Recipe;
};