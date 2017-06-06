angular.module("game")

.controller("game.GameController", ["$scope", "game.Game",
function ($scope, Game) { // eslint-disable-line indent

  "use strict";

  $scope.game = Game.generate();

  $scope.restart = () => {
    $scope.game = Game.generate();
  };

}]);
