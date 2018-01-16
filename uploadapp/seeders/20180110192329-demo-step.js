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
    return queryInterface.bulkInsert('Steps', [{
        stepId: 1,
        shortDescription: 'Recipe Introduction',
        description: 'Recipe Introduction',
        videoURL: 'https://d17h27t6h515a5.cloudfront.net/topher/2017/April/58ffd974_-intro-creampie/-intro-creampie.mp4',
        thumbnailURL: '',
        createdAt: 20180110190157,
        updatedAt: 20180110190157,
        recipeId: 1
      }, 
      {
        stepId: 2,
        shortDescription: 'Starting prep',
        description: '1. Preheat the oven to 350\\u00b0F. Butter a 9\\\" deep dish pie pan.',
        videoURL: '',
        thumbnailURL: '',
        createdAt: 20180110190157,
        updatedAt: 20180110190157,
        recipeId: 1
      },
      {
        stepId: 3,
        shortDescription: 'Prep the cookie crust.',
        description: '2. Whisk the graham cracker crumbs, 50 grams (1/4 cup) of sugar, and 1/2 teaspoon of salt together in a medium bowl. Pour the melted butter and 1 teaspoon of vanilla into the dry ingredients and stir together until evenly mixed.',
        videoURL: 'https://d17h27t6h515a5.cloudfront.net/topher/2017/April/58ffd9a6_2-mix-sugar-crackers-creampie/2-mix-sugar-crackers-creampie.mp4',
        thumbnailURL: '',
        createdAt: 20180110190157,
        updatedAt: 20180110190157,
        recipeId: 1
      },
      {
        stepId: 4,
        shortDescription: 'Press the crust into baking form.',
        description: '3. Press the cookie crumb mixture into the prepared pie pan and bake for 12 minutes. Let crust cool to room temperature.',
        videoURL: 'https://d17h27t6h515a5.cloudfront.net/topher/2017/April/58ffd9cb_4-press-crumbs-in-pie-plate-creampie/4-press-crumbs-in-pie-plate-creampie.mp4',
        thumbnailURL: '',
        createdAt: 20180110190157,
        updatedAt: 20180110190157,
        recipeId: 1
      },
      {
        stepId: 5,
        shortDescription: 'Start filling prep',
        description: '4. Beat together the nutella, mascarpone, 1 teaspoon of salt, and 1 tablespoon of vanilla on medium speed in a stand mixer or high speed with a hand mixer until fluffy.',
        videoURL: 'https://d17h27t6h515a5.cloudfront.net/topher/2017/April/58ffd97a_1-mix-marscapone-nutella-creampie/1-mix-marscapone-nutella-creampie.mp4',
        thumbnailURL: '',
        createdAt: 20180110190157,
        updatedAt: 20180110190157,
        recipeId: 1
      },
      {
        stepId: 6,
        shortDescription: 'Finish filling prep',
        description: '5. Beat the cream cheese and 50 grams (1/4 cup) of sugar on medium speed in a stand mixer or high speed with a hand mixer for 3 minutes. Decrease the speed to medium-low and gradually add in the cold cream. Add in 2 teaspoons of vanilla and beat until stiff peaks form.',
        videoURL: 'https://d17h27t6h515a5.cloudfront.net/topher/2017/April/58ffda20_7-add-cream-mix-creampie/7-add-cream-mix-creampie.mp4',
        thumbnailURL: '',
        createdAt: 20180110190157,
        updatedAt: 20180110190157,
        recipeId: 1
      },
      {
        stepId: 7,
        shortDescription: 'Finishing Steps',
        description: '6. Pour the filling into the prepared crust and smooth the top. Spread the whipped cream over the filling. Refrigerate the pie for at least 2 hours. Then it\'s ready to serve!',
        videoURL: 'https://d17h27t6h515a5.cloudfront.net/topher/2017/April/58ffda45_9-add-mixed-nutella-to-crust-creampie/9-add-mixed-nutella-to-crust-creampie.mp4',
        thumbnailURL: '',
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
    return queryInterface.bulkDelete('Steps', null, {});
  }
};
