angular.module("game")

.controller("game.GameController", ["$scope", "game.GameService", function ($scope, GameService) {

  $scope.game = GameService.generate();

}]);
