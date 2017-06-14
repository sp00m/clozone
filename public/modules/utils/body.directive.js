angular.module("utils")

.directive("body", ["$rootScope",
function ($rootScope) { // eslint-disable-line indent

  "use strict";

  return {
    restrict: "E",
    link: (scope, $$element) => {

      $rootScope.$on("$stateChangeSuccess", (event, toState, toParams, fromState) => {
        $$element.removeClass(fromState.name).addClass(toState.name);
      });

    }
  };

}]);
