angular.module("home")

.controller("home.HomeController", ["$scope", "$state",
function ($scope, $state) { // eslint-disable-line indent

  "use strict";

  $scope.startSoloEasy = () => {
    $state.go("game", {
      mode: "solo",
      feature: "easy",
      property: "first"
    });
  };

  $scope.startSoloHard = () => {
    $state.go("game", {
      mode: "solo",
      feature: "hard",
      property: "first"
    });
  };

  $scope.startMultiOffline = () => {
    $state.go("game", {
      mode: "multi",
      feature: "offline"
    });
  };

}]);
