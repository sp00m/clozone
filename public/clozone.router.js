angular.module("clozone")

.config(["$stateProvider", "$urlRouterProvider",
function ($stateProvider, $urlRouterProvider) { // eslint-disable-line indent

  "use strict";

  $stateProvider

    .state({
      name: "home",
      url: "/home",
      templateUrl: "modules/home/home.html",
      controller: "home.HomeController"
    })

    .state({
      name: "game",
      url: "/play",
      templateUrl: "modules/game/game.html",
      controller: "game.GameController"
    });

  $urlRouterProvider.otherwise("/home");

}]);
