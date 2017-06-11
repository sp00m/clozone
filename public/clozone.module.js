angular.module("clozone", ["ui.router", "home", "game"])

.constant("game.COLOR1", "#008F95")
.constant("game.COLOR2", "#E9B000")

.run(["$rootScope", "$window", "game.COLOR1", "game.COLOR2",
function ($rootScope, $window, COLOR1, COLOR2) { // eslint-disable-line indent

  "use strict";

  Object.assign($rootScope, {
    version: $window.clozone.version,
    color1: COLOR1,
    color2: COLOR2
  });

}]);
