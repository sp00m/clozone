angular.module("game")

.controller("game.GameController", ["$scope", "game.Game", "game.createPlayerBuilder", "$state", "$stateParams", "$log",
function ($scope, Game, createPlayerBuilder, $state, $stateParams, $log) { // eslint-disable-line indent

  "use strict";

  let playerBuilder = null;
  try {
    playerBuilder = createPlayerBuilder($stateParams);
  } catch (error) {
    $log.error("An error occurred while creating player builder:", error);
    $state.go("home");
  }

  $scope.$watch("game", () => {
    if ($scope.game) {
      $scope.game.start();
    }
  });

  $scope.game = Game.generate(playerBuilder);

  $scope.restart = () => {
    $scope.game = Game.generate(playerBuilder);
  };

}]);
