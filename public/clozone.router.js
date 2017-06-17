angular.module("clozone")

.config(["$stateProvider", "$urlRouterProvider", "utils.vProvider",
function ($stateProvider, $urlRouterProvider, vProvider) { // eslint-disable-line indent

  "use strict";

  const v = vProvider.$get();

  $stateProvider

    .state({
      name: "home",
      url: "/home",
      templateUrl: v("modules/home/home.html"),
      controller: "home.HomeController"
    })

    .state({
      name: "game",
      url: "/play/:mode/:feature/:property?",
      templateUrl: v("modules/game/game.html"),
      controller: "game.GameController"
    });

  $urlRouterProvider.otherwise("/home");

}]);
