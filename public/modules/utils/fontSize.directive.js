angular.module("utils")

.directive("fontSize", [
function () { // eslint-disable-line indent

  return {
    restrict: "A",
    scope: {
      ratio: "=fontSize",
      modelId: "@of"
    },
    link: (scope, $element) => {

      const $window = $(window);
      const $model = angular.element(`#${scope.modelId}`);
      const setFontSize = () => $element.css("font-size", `${$model.width() * scope.ratio / 100}px`);

      setFontSize();
      $window.on("resize", setFontSize);
      scope.$on("$destroy", () => $window.off("resize", setFontSize));

    }
  };

}]);
