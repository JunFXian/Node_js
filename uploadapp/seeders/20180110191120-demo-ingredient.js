'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Ingredients', [{
        quantity: 2,
        measure: 'CUP',
        ingredient: 'Graham Cracker crumbs',
        createdAt: 20180110190157,
        updatedAt: 20180110190157,
        recipeId: 1
      }, 
      {
        quantity: 6,
        measure: 'TBLSP',
        ingredient: 'unsalted butter, melted',
        createdAt: 20180110190157,
        updatedAt: 20180110190157,
        recipeId: 1
      },
      {
        quantity: 0.5,
        measure: 'CUP',
        ingredient: 'granulated sugar',
        createdAt: 20180110190157,
        updatedAt: 20180110190157,
        recipeId: 1
      },
      {
        quantity: 1.5,
        measure: 'TSP',
        ingredient: 'salt',
        createdAt: 20180110190157,
        updatedAt: 20180110190157,
        recipeId: 1
      },
      {
        quantity: 5,
        measure: 'TBLSP',
        ingredient: 'vanilla',
        createdAt: 20180110190157,
        updatedAt: 20180110190157,
        recipeId: 1
      },
      {
        quantity: 1,
        measure: 'K',
        ingredient: 'Nutella or other chocolate-hazelnut spread',
        createdAt: 20180110190157,
        updatedAt: 20180110190157,
        recipeId: 1
      },
      {
        quantity: 500,
        measure: 'G',
        ingredient: 'Mascapone Cheese(room temperature)',
        createdAt: 20180110190157,
        updatedAt: 20180110190157,
        recipeId: 1
      },
      {
        quantity: 1,
        measure: 'CUP',
        ingredient: 'heavy cream(cold)',
        createdAt: 20180110190157,
        updatedAt: 20180110190157,
        recipeId: 1
      },
      {
        quantity: 4,
        measure: 'OZ',
        ingredient: 'cream cheese(softened)',
        createdAt: 20180110190157,
        updatedAt: 20180110190157,
        recipeId: 1
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('Ingredients', null, {});
  }
};
