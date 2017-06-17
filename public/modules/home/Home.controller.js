angular.module("home")

.controller("home.HomeController", ["$scope", "$state",
function ($scope, $state) { // eslint-disable-line indent

  "use strict";

  $scope.whoStarts = false;
  let startSolo = null;

  const buildStartSolo = (feature) => (property) => {
    $state.go("game", {
      mode: "solo",
      feature,
      property
    });
  };

  $scope.startSoloEasy = () => {
    startSolo = buildStartSolo("easy");
    $scope.whoStarts = true;
  };

  $scope.startSoloHard = () => {
    startSolo = buildStartSolo("hard");
    $scope.whoStarts = true;
  };

  $scope.startMultiOffline = () => {
    $state.go("game", {
      mode: "multi",
      feature: "offline"
    });
  };

  $scope.startFirst = () => {
    $scope.whoStarts = false;
    startSolo("first");
  };

  $scope.startSecond = () => {
    $scope.whoStarts = false;
    startSolo("second");
  };

}]);
