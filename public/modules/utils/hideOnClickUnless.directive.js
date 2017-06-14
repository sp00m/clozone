angular.module("utils")

.directive("hideOnClickUnless", [
function () { // eslint-disable-line indent

  "use strict";

  return {
    restrict: "A",
    scope: {
      selector: "@hideOnClickUnless",
      flag: "=ngShow"
    },
    link: (scope, $$element) => {

      $$element.on("click", (event) => {
        if (0 === angular.element(event.target).closest(scope.selector).length) {
          scope.$apply(() => {
            scope.flag = false;
          });
        }
      });

    }
  };

}]);
