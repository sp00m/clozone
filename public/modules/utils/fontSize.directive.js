angular.module("utils")

.directive("fontSize", ["$window",
function ($window) { // eslint-disable-line indent

  "use strict";

  return {
    restrict: "A",
    scope: {
      ratio: "=fontSize",
      modelId: "@of"
    },
    link: (scope, $$element) => {

      const $$window = angular.element($window);
      const $$model = angular.element(`#${scope.modelId}`);
      const setFontSize = () => $$element.css("font-size", `${$$model.width() * scope.ratio / 100}px`);

      const ifDefined = (callback) => (watched) => {
        if (typeof watched !== "undefined") {
          callback();
        }
      };

      scope.$watch("ratio", ifDefined(setFontSize));
      scope.$watch("modelId", ifDefined(setFontSize));
      $$window.on("resize", setFontSize);
      scope.$on("$destroy", () => {
        $$window.off("resize", setFontSize);
      });

    }
  };

}]);
