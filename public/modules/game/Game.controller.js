angular.module("game")

.controller("game.GameController", ["$scope", "game.GameService",
function ($scope, GameService) { // eslint-disable-line indent

  $scope.game = GameService.generate();

}]);
