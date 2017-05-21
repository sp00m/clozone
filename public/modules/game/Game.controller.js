angular.module("game")

.controller("game.GameController", ["$scope", "game.Game",
function ($scope, Game) { // eslint-disable-line indent

  $scope.game = Game.generate();

}]);
