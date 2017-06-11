angular.module("game", ["ngAnimate", "generator", "player", "utils"])

/* eslint-disable no-magic-numbers */
.constant("game.X_SCALE", 112 / 2)
.constant("game.Y_SCALE", 97)
.constant("game.X_MARGIN", 5 / 100)
.constant("game.Y_MARGIN", 0 / 100)
.constant("game.COLOR1", "#008F95")
.constant("game.COLOR2", "#E9B000")
/* eslint-enable no-magic-numbers */

.run(["$rootScope", "game.COLOR1", "game.COLOR2",
function ($rootScope, COLOR1, COLOR2) { // eslint-disable-line indent

  "use strict";

  $rootScope.color1 = COLOR1;
  $rootScope.color2 = COLOR2;

}]);
