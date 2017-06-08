angular.module("game")

.controller("game.GameController", ["$scope", "game.Game",
function ($scope, Game) { // eslint-disable-line indent

  "use strict";

  $scope.$watch("game", () => {
    if ($scope.game) {
      $scope.game.start();
    }
  });

  $scope.game = Game.generate();

  $scope.restart = () => {
    $scope.game = Game.generate();
  };

}]);
