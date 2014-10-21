'use strict';

angular.module('budgetApp')
  .factory('Budgets', function ($resource, User, Auth, BudgetCommunication) {
    var budgets = [];

    function encodeBudget(budget) {
      var encodedBudget = {
        name : budget.name,
        info : budget.info,
        interval : budget.interval,
        intervaldata : [],
        _owner : Auth.getCurrentUser()._id,
        access : [],
        currencySymbol : "€",
      };
      encodedBudget.intervaldata.push({startdate: budget.startdate, budget: budget.budget});
      encodedBudget.access.push({_userid: Auth.getCurrentUser()._id});
      return encodedBudget;
    };

    budgets = BudgetCommunication.index();

    return {

      getBudgets: function() {
        return budgets;
      },
      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createBudget: function(budget, callback) {
        var cb = callback || angular.noop;
        var budgetEncoded = encodeBudget(budget);

        return BudgetCommunication.save(budgetEncoded,
          function(data) {
            budgets = BudgetCommunication.index();
            // currentBudget = BudgetCommunication.getCurrent();
            return cb(currentBudget);
          },
          function(err) {
            return cb(err);
          }.bind(this)).$promise;
      },

    };
  });
